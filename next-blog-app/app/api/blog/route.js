import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
const { NextResponse } = require("next/server");
import { writeFile } from "fs/promises";
const fs = require("fs");

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

  await BlogModel.create(blogData);
  console.log("Blog Saved");
  return NextResponse.json({ success: true, msg: "Blog Added" });
}

// DELETE: remove blog
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
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

    // "newImage" might be a File if changed, or just "undefined" if no file is selected
    // Next.js formData file object has a "name" property if it's actually a file
    if (newImage && newImage.name) {
      // Delete old image if you want to avoid orphaned files
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
    // date can remain or be updated with new Date() if you want to change last-modified

    await existingBlog.save();

    return NextResponse.json({ success: true, msg: "Blog Updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: "Error updating blog" });
  }
}
