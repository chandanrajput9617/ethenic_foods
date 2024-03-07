import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import csvParser from "csv-parser";
import fs from "fs";
import Tax from "../../models/tax.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const TaxCsvFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No CSV file uploaded"));
    }

    const filePath = req.file.path;

    const stream = fs.createReadStream(filePath).pipe(csvParser());
    const updatedTaxs = [];
    let documentsProcessedCount = 0;
    const promises = [];

    stream.on("data", (row) => {
      let { "State Code": stateCode, "State Tax Rate": stateTaxCode } = row;

      stateTaxCode =
        parseFloat(stateTaxCode.toString().replace("%", "")) || stateTaxCode;

      const filter = { state_code: stateCode };
      const update = {
        $set: { state_code: stateCode, state_tax_rate: stateTaxCode },
      };
      const options = { upsert: true, new: true };

      const promise = Tax.findOneAndUpdate(filter, update, options)
        .then((updatedTax) => {
          if (!updatedTax) {
            return Tax.create({
              state_code: stateCode,
              state_tax_rate: stateTaxCode,
            });
          }
          return updatedTax;
        })
        .then((result) => {
          updatedTaxs.push(result);
          documentsProcessedCount++;
        })
        .catch((updateError) => {
          console.error(
            `Error updating/inserting document with state Code ${stateCode}: ${updateError.message}`
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
              updatedTaxs,
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

const createTax = asyncHandler(async (req, res) => {
  const { stateCode, stateTaxRate } = req.body;

  const createTaxData = await Tax.create({
    state_code: stateCode,
    state_tax_rate: stateTaxRate,
  });

  if (!createTaxData) {
    throw new ApiError(400, "Something went wrong while creating tax.");
  }

  res.status(201).json(new ApiResponse(201, createTaxData, "success"));
});

const getTax = asyncHandler(async (req, res) => {
  const taxData = await Tax.find();

  if (!taxData) {
    return res.status(404).json(new ApiResponse(404, null, "Tax not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, taxData, "Tax retrieved successfully"));
});

const updateTax = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stateCode, stateTaxRate } = req.body;

  const updatedTax = await Tax.findByIdAndUpdate(
    id,
    { state_code: stateCode, state_tax_rate: stateTaxRate },
    { new: true }
  );

  if (!updatedTax) {
    return res.status(404).json(new ApiResponse(404, null, "Tax not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTax, "Tax updated successfully"));
});

const deleteTax = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedTax = await Tax.findByIdAndDelete(id);

  if (!deletedTax) {
    return res.status(404).json(new ApiResponse(404, null, "Tax not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedTax, "Tax deleted successfully"));
});

export { createTax, getTax, updateTax, deleteTax };
