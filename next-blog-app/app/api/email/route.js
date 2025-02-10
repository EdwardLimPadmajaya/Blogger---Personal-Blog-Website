import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
const { NextResponse } = require("next/server");

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();

// API Endpoint For Subscribing Email
export async function POST(request) {
    const formData = await request.formData();
    const emailData = {
        email: `${formData.get('email')}`,
    }

    await EmailModel.create(emailData);
    return NextResponse.json({success:true, msg: "Email Subscribed"});
}

// API Endpoint For Getting All Subscribed Emails
export async function GET(request) {
    const emails = await EmailModel.find({});
    return NextResponse.json({emails});
}

// API Endpoint For Deleting Email
export async function DELETE(request) {
    const id = await request.nextUrl.searchParams.get('id');
    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({success:true, msg: "Email Deleted"});
}