// /app/api/blog/route.js

import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import EmailModel from "@/lib/models/EmailModel";  // <-- import the EmailModel
const { NextResponse } = require("next/server");
import { writeFile } from "fs/promises";
import fs from "fs";
import nodemailer from "nodemailer";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

// GET: fetch all or single blog
export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  }
  const blogs = await BlogModel.find({});
  return NextResponse.json({ blogs });
}

// POST: create a new blog
export async function POST(request) {
  try {
    const formData = await request.formData();
    const timestamp = Date.now();
    const image = formData.get("image");
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: imgUrl,
      authorImg: formData.get("authorImg"),
      date: new Date(),
    };

    // 1) Create the new blog in the database
    await BlogModel.create(blogData);
    console.log("Blog Saved");

    // 2) Fetch all subscribed emails
    const subscribedEmails = await EmailModel.find({});

    // 3) Create Nodemailer transporter
    //    Replace these with real SMTP settings or a service like SendGrid/Gmail
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: false, // or `true` if your SMTP uses TLS
    });

    // 4) Send emails to each subscriber 
    //    (For large lists, consider using BCC or a queue to avoid timeouts)
    for (const subscriber of subscribedEmails) {
      await transporter.sendMail({
        from: `"Your Site" <${process.env.SMTP_USER}>`,
        to: subscriber.email,
        subject: "New Article Published",
        text: `Hello! We have a new article: "${blogData.title}"`,
        // or use HTML if you want a richer format:
        // html: `<p>Hello!</p><p>We have a new article: <strong>${blogData.title}</strong></p>`
      });
    }

    return NextResponse.json({ success: true, msg: "Blog Added & Emails Sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: "Error creating blog" });
  }
}

// DELETE: remove blog
export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => {});
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, msg: "Blog Deleted" });
}

// PUT: update an existing blog
export async function PUT(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");
    if (!blogId) {
      return NextResponse.json({ success: false, msg: "No blog ID provided" });
    }

    const existingBlog = await BlogModel.findById(blogId);
    if (!existingBlog) {
      return NextResponse.json({ success: false, msg: "Blog not found" });
    }

    const formData = await request.formData();

    // If user uploads a new image, handle it; otherwise, keep the existing one
    let imgUrl = existingBlog.image;
    const newImage = formData.get("image");

    if (newImage && newImage.name) {
      fs.unlink(`./public${existingBlog.image}`, () => {});
      const timestamp = Date.now();
      const imageByteData = await newImage.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      const path = `./public/${timestamp}_${newImage.name}`;
      await writeFile(path, buffer);
      imgUrl = `/${timestamp}_${newImage.name}`;
    }

    // Update fields
    existingBlog.title = formData.get("title");
    existingBlog.description = formData.get("description");
    existingBlog.category = formData.get("category");
    existingBlog.author = formData.get("author");
    existingBlog.authorImg = formData.get("authorImg");
    existingBlog.image = imgUrl;

    await existingBlog.save();

    return NextResponse.json({ success: true, msg: "Blog Updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: "Error updating blog" });
  }
}
