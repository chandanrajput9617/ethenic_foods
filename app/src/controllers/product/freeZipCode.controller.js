import { FreeZipCode } from "../../models/freeZipCode.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import csvParser from "csv-parser";
import fs from "fs";

export const createFreeZipCode = async (req, res) => {
  try {
    const {
      zipCode,
      shipment_delivery_message,
      stateCode,
      stateName,
      city,
      county,
      countyAll,
      timeZone,
      latitude,
      longitude,
    } = req.body;

    const isFreeZipCodeExist = await FreeZipCode.findOne({ zipCode });

    if (isFreeZipCodeExist) {
      return res.status(200).json({
        status: 200,
        data: isFreeZipCodeExist,
        message: "Free zip code already exists.",
      });
    }

    const newFreeZipCode = new FreeZipCode({
      zipCode,
      shipment_delivery_message,
      stateCode,
      stateName,
      city,
      county,
      countyAll,
      timeZone,
      latitude,
      longitude,
    });

    const savedFreeZipCode = await newFreeZipCode.save();

    return res.status(200).json({
      status: 200,
      data: savedFreeZipCode,
      message: "Free zip code created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message || error.Error,
    });
  }
};

// Read all FreeZipCodes
export const getAllFreeZipCodes = async (req, res) => {
  try {
    const freeZipCodes = await FreeZipCode.find();
    return res.json(new ApiResponse(200, freeZipCodes, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Read one FreeZipCode by ID
export const getOneFreeZipCode = async (req, res) => {
  try {
    const freeZipCode = await FreeZipCode.findById(req.params.id);

    if (!freeZipCode) {
      return res.status(404).json(new ApiError(404, "Free Zip Code not found"));
    }

    res.json(new ApiResponse(200, freeZipCode, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Update FreeZipCode by ID
export const updateFreeZipCode = async (req, res) => {
  try {
    const updatedFreeZipCode = await FreeZipCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedFreeZipCode) {
      return res.status(404).json(new ApiError(404, "Free Zip Code not found"));
    }

    res.json(new ApiResponse(200, updatedFreeZipCode, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Delete FreeZipCode by ID
export const deleteFreeZipCode = async (req, res) => {
  try {
    const deletedFreeZipCode = await FreeZipCode.findByIdAndDelete(
      req.params.id
    );

    if (!deletedFreeZipCode) {
      return res.status(404).json(new ApiError(404, "Free Zip Code not found"));
    }

    return res.json(
      new ApiResponse(
        200,
        { message: "Success" },
        "Free Zip Code deleted successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export const freeZipCodeCsvFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No CSV file uploaded"));
    }

    const filePath = req.file.path;

    const stream = fs.createReadStream(filePath).pipe(csvParser());
    const updatedFreeZipCodes = [];
    let documentsProcessedCount = 0;
    const promises = [];

    stream.on("data", async (row) => {
      const {
        "Zip Code": zipCode,
        "Shipment Delivery Message": shipment_delivery_message,
        "State Code": stateCode,
        "State Name": stateName,
        City: city,
        County: county,
        "County All": countyAll,
        "Time Zone": timeZone,
        Latitude: latitude,
        Longitude: longitude,
      } = row;

      const filter = { zipCode };
      const update = {
        $set: {
          shipment_delivery_message,
          stateCode,
          stateName,
          city,
          county,
          countyAll,
          timeZone,
          latitude,
          longitude,
        },
      };
      const options = { upsert: true, new: true };

      const promise = FreeZipCode.findOneAndUpdate(filter, update, options)
        .then((updatedFreeZipCode) => {
          if (!updatedFreeZipCode) {
            return FreeZipCode.create({
              zipCode,
              shipment_delivery_message,
              stateCode,
              stateName,
              city,
              county,
              countyAll,
              timeZone,
              latitude,
              longitude,
            });
          }
          return updatedFreeZipCode;
        })
        .then((result) => {
          updatedFreeZipCodes.push(result);
          documentsProcessedCount++;
        })
        .catch((updateError) => {
          console.error(
            `Error updating/inserting document with zipCode ${zipCode}: ${updateError.message}`
          );
        });

      promises.push(promise);
    });

    stream.on("end", async () => {
      try {
        await Promise.all(promises);
        fs.unlinkSync(filePath);

        res
          .status(200)
          .json(
            new ApiResponse(
              200,
              updatedFreeZipCodes,
              `CSV file processed successfully. ${documentsProcessedCount} documents processed.`
            )
          );
      } catch (promiseAllError) {
        console.error(`Error in Promise.all: ${promiseAllError.message}`);
        return res.status(500).json(new ApiError(500, promiseAllError.message));
      }
    });
  } catch (error) {
    console.error("Error processing CSV file:", error.message);
    return res.status(500).json(new ApiError(500, error.message));
  }
};
