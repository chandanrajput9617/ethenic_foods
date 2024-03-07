import fs from "fs";
import csvParser from "csv-parser";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import ShipmentRateState from "../../models/shipmentRateState.model.js";

export const shipmentRateStateCsvFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No CSV file uploaded"));
    }

    const filePath = req.file.path;
    const updatedShipmentRateState = [];
    let documentsProcessedCount = 0;
    const promises = [];

    const stream = fs.createReadStream(filePath).pipe(csvParser());

    stream.on("data", async (row) => {
      const {
        State: state,
        Postal: postal,
        "Shipment State Rate (SSSR)": shipment_state_rate,
        "Shipment Delivery Message": shipment_delivery_message,
        "State Code": state_code,
      } = row;

      try {
        // Parse the numeric value without the "$" symbol
        const parsedSSR = parseFloat(shipment_state_rate.replace("$", ""));

        const filter = { state_code };
        const update = {
          $set: {
            state,
            postal,
            shipment_state_rate: isNaN(parsedSSR) ? 0 : parsedSSR,
            shipment_delivery_message,
            state_code,
          },
        };
        const options = { upsert: true, new: true };

        const promise = ShipmentRateState.findOneAndUpdate(
          filter,
          update,
          options
        )
          .then((updatedData) => {
            if (!updatedData) {
              return ShipmentRateState.create({
                state,
                postal,
                shipment_state_rate: isNaN(parsedSSR) ? 0 : parsedSSR,
                shipment_delivery_message,
                state_code,
              });
            }
            return updatedData;
          })
          .then((result) => {
            updatedShipmentRateState.push(result);
            documentsProcessedCount++;
          })
          .catch((updateError) => {
            console.error(
              `Error updating/inserting document with State Code ${state_code}: ${updateError.message}`
            );
          });

        promises.push(promise);
      } catch (updateError) {
        console.error(
          `Error updating/inserting document with State Code ${state_code}: ${updateError.message}`
        );
      }
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
              updatedShipmentRateState,
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

export const createShipmentRateState = async (req, res) => {
  try {
    const existingState = await ShipmentRateState.findOne({
      state: req.body.state?.toUpperCase(),
    });

    if (existingState) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "State already exists"));
    }

    const newShipmentRateState = await ShipmentRateState.create({
      state: req.body.state?.toUpperCase(),
      postal: req.body.postal,
      shipment_state_rate: isNaN(req.body.shipment_state_rate)
        ? 0
        : req.body.shipment_state_rate,
      shipment_delivery_message: req.body.shipment_delivery_message,
      state_code: req.body.state_code,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newShipmentRateState,
          "Shipment rate state created successfully."
        )
      );
  } catch (error) {
    console.error("Error creating shipment rate state:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const getShipmentRateState = async (req, res) => {
  try {
    const getData = await ShipmentRateState.find();
    return res.json(
      new ApiResponse(200, getData, "Get shipment rate state successfully.")
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};
export const updateShipmentRateState = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = {};

    if (req.body.state) {
      updateData = { ...updateData, state: req.body.state?.toUpperCase() };
    }

    if (req.body.postal) {
      updateData = { ...updateData, postal: req.body.postal };
    }
    if (req.body.shipment_delivery_message) {
      updateData = {
        ...updateData,
        shipment_delivery_message: req.body.shipment_delivery_message,
      };
    }

    if (req.body.state_code) {
      updateData = {
        ...updateData,
        state_code: req.body.state_code,
      };
    }

    if (req.body.shipment_state_rate) {
      const shipmentStateRate = parseFloat(req.body.shipment_state_rate);
      updateData = { ...updateData, shipment_state_rate: shipmentStateRate };
    }

    const updatedState = await ShipmentRateState.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedState) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "State not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedState,
          "Shipment rate state updated successfully."
        )
      );
  } catch (error) {
    console.error("Error updating state:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const deleteShipmentRateState = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedState = await ShipmentRateState.findByIdAndDelete(id);

    if (!deletedState) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "State not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Shipment rate state deleted successfully.")
      );
  } catch (error) {
    console.error("Error deleting state:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};
