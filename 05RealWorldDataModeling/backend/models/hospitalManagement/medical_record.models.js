import mongoose from "mongoose"

const medicarRecordSchema = new mongoose.Schema(
    {

    }
)
export const MedicalRecord = mongoose.model('MedicalRecord',medicarRecordSchema)