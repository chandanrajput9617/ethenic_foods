import fs from "fs";
import csvParser from "csv-parser";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Dimension from "../../models/Dimensions.model.js";
import DimensionWeightRange from "../../models/dimensionWeightRange.model.js";

export const createDimension = async (req, res) => {
  try {
    const { dimensions, Length, Width, Height, shipment_dimension_price } =
      req.body;

    const createData = await Dimension.create({
      dimensions: dimensions,
      length: parseFloat(Length),
      width: parseFloat(Width),
      height: parseFloat(Height),
      shipment_dimension_price: shipment_dimension_price,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, createData, "Dimension created successfully.")
      );
  } catch (error) {
    console.error("Error creating dimension:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};
export const getDimension = async (req, res) => {
  try {
    const getData = await Dimension.find();

    const shortDimentionsData = getData.sort((a, b) => {
      if (a.dimensions === b.dimensions) return 0;
      return a.dimensions > b.dimensions ? 1 : -1;
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, shortDimentionsData, `Get dimension successfully.`)
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export const updateDimension = async (req, res) => {
  try {
    const { id } = req.params;
    const { dimensions, Length, Width, Height, shipment_dimension_price } =
      req.body;

    const updateFields = {};

    if (dimensions) {
      updateFields.dimensions = dimensions;
    }

    if (Length) {
      updateFields.length = parseFloat(Length);
    }

    if (Width) {
      updateFields.width = parseFloat(Width);
    }

    if (Height) {
      updateFields.height = parseFloat(Height);
    }

    if (shipment_dimension_price) {
      updateFields.shipment_dimension_price = parseFloat(
        shipment_dimension_price.replace("$", "")
      );
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "No valid fields provided for update")
        );
    }

    const updatedData = await Dimension.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedData) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dimension not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedData, "Dimension updated successfully")
      );
  } catch (error) {
    console.error("Error updating dimension:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const deleteDimension = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedData = await Dimension.findByIdAndDelete(id);

    if (!deletedData) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dimension not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, deletedData, "Dimension deleted successfully")
      );
  } catch (error) {
    console.error("Error deleting dimension:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const dimensionCsvFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No CSV file uploaded"));
    }

    const filePath = req.file.path;
    const updatedDimensions = [];
    let documentsProcessedCount = 0;
    const promises = [];

    const stream = fs.createReadStream(filePath).pipe(csvParser());

    stream.on("data", async (row) => {
      const {
        Dimensions,
        Length,
        Width,
        Height,
        "Shipment Dimension Price": shipment_dimension_price,
      } = row;

      try {
        const filter = {
          length: parseFloat(Length),
          width: parseFloat(Width),
          height: parseFloat(Height),
        };
        const update = {
          $set: {
            dimensions: Dimensions,
            length: parseFloat(Length),
            width: parseFloat(Width),
            height: parseFloat(Height),
            shipment_dimension_price: shipment_dimension_price
              ? parseFloat(shipment_dimension_price.replace("$", ""))
              : 0,
          },
        };
        const options = { upsert: true, new: true };

        const promise = Dimension.findOneAndUpdate(filter, update, options)
          .then((updatedData) => {
            if (!updatedData) {
              return Dimension.create({
                dimensions: Dimensions,
                length: parseFloat(Length),
                width: parseFloat(Width),
                height: parseFloat(Height),
                shipment_dimension_price: shipment_dimension_price
                  ? parseFloat(shipment_dimension_price.replace("$", ""))
                  : 0,
              });
            }
            return updatedData;
          })
          .then((result) => {
            updatedDimensions.push(result);
            documentsProcessedCount++;
          })
          .catch((updateError) => {
            console.error(
              `Error updating/inserting document with dimensions ${JSON.stringify(
                row
              )}: ${updateError.message}`
            );
          });

        promises.push(promise);
      } catch (updateError) {
        console.error(
          `Error updating/inserting document with dimensions ${JSON.stringify(
            row
          )}: ${updateError.message}`
        );
      }
    });

    stream.on("end", async () => {
      try {
        await Promise.all(promises);
        console.log("After Promise.all:", updatedDimensions.length);

        fs.unlinkSync(filePath);

        res
          .status(200)
          .json(
            new ApiResponse(
              200,
              updatedDimensions,
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

export const createDimensionWeightRange = async (req, res) => {
  try {
    const { dimensions, Length, Width, Height, weight_range } = req.body;

    const createData = await DimensionWeightRange.create({
      dimensions,
      weight_range,
      length: parseFloat(Length),
      width: parseFloat(Width),
      height: parseFloat(Height),
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createData,
          "Dimension weight range created successfully."
        )
      );
  } catch (error) {
    console.error("Error creating dimension weight range:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const getDimensionWeightRange = async (req, res) => {
  try {
    const getData = await DimensionWeightRange.find();

    const shortDimentionWeightRangeData = getData.sort((a, b) => {
      if (a.dimensions === b.dimensions) return 0;
      return a.dimensions > b.dimensions ? 1 : -1;
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          shortDimentionWeightRangeData,
          `Get dimension weight range  successfully.`
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

export const updateDimensionWeightRange = async (req, res) => {
  try {
    const { id } = req.params;
    const { dimensions, Length, Width, Height, weight_range } = req.body;

    let updateDimensionWeightRangeData = {};

    if (dimensions) {
      updateDimensionWeightRangeData = {
        ...updateDimensionWeightRangeData,
        dimensions: dimensions,
      };
    }

    if (Length) {
      updateDimensionWeightRangeData = {
        ...updateDimensionWeightRangeData,
        length: parseFloat(Length),
      };
    }

    if (Width) {
      updateDimensionWeightRangeData = {
        ...updateDimensionWeightRangeData,
        width: parseFloat(Width),
      };
    }

    if (Height) {
      updateDimensionWeightRangeData = {
        ...updateDimensionWeightRangeData,
        height: parseFloat(Height),
      };
    }

    if (weight_range) {
      updateDimensionWeightRangeData = {
        ...updateDimensionWeightRangeData,
        weight_range,
      };
    }

    const updatedData = await DimensionWeightRange.findByIdAndUpdate(
      id,
      updateDimensionWeightRangeData,
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dimension weight range not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedData,
          "Dimension weight range updated successfully"
        )
      );
  } catch (error) {
    console.error("Error updating dimension weight range:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};
export const deleteDimensionWeightRange = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedData = await DimensionWeightRange.findByIdAndDelete(id);

    if (!deletedData) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Dimension weight range not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedData,
          "Dimension weight range deleted successfully"
        )
      );
  } catch (error) {
    console.error("Error deleting Dimension weight range:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const dimensionWeightRangeCsvFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No CSV file uploaded"));
    }

    const filePath = req.file.path;
    const updatedDimensionWeightRanges = [];
    let documentsProcessedCount = 0;
    const promises = [];

    const stream = fs.createReadStream(filePath).pipe(csvParser());

    stream.on("data", async (row) => {
      const {
        Dimensions: dimensions,
        Length,
        Width,
        Height,
        "Weight Range": weight_range,
      } = row;

      try {
        const filter = { dimensions, weight_range };
        const update = {
          $set: {
            dimensions,
            weight_range,
            length: parseFloat(Length),
            width: parseFloat(Width),
            height: parseFloat(Height),
          },
        };
        const options = { upsert: true, new: true };
        const promise = DimensionWeightRange.findOneAndUpdate(
          filter,
          update,
          options
        )
          .then((updatedData) => {
            if (!updatedData) {
              return DimensionWeightRange.create({
                dimensions,
                weight_range,
                length: parseFloat(Length),
                width: parseFloat(Width),
                height: parseFloat(Height),
              });
            }
            return updatedData;
          })
          .then((result) => {
            updatedDimensionWeightRanges.push(result);
            documentsProcessedCount++;
          })
          .catch((updateError) => {
            console.error(
              `Error updating/inserting document with dimensions and weight_range ${JSON.stringify(
                row
              )}: ${updateError.message}`
            );
          });

        promises.push(promise);
      } catch (updateError) {
        console.error(
          `Error updating/inserting document with dimensions and weight_range ${JSON.stringify(
            row
          )}: ${updateError.message}`
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
              updatedDimensionWeightRanges,
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
