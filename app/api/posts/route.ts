import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

// Ensure the uploads directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directory:", error);
  }
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    const posts = JSON.parse(fileContent);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error reading posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const location = formData.get("location") as string;
    const time = formData.get("time") as string;
    const file = formData.get("image") as File | null;

    let imageUrl: string | undefined;
    if (file) {
      await ensureUploadDir();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imageUrl = `/uploads/${fileName}`;
    }

    const newPost = {
      id: Date.now(),
      author,
      location,
      content,
      image: imageUrl,
      likes: 0,
      comments: 0,
      time,
    };

    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    const posts = JSON.parse(fileContent);
    posts.push(newPost);
    await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    let posts = JSON.parse(fileContent);

    const postIndex = posts.findIndex((post: any) => post.id === id);
    if (postIndex !== -1) {
      const post = posts[postIndex];
      if (post.image) {
        const imagePath = path.join(process.cwd(), "public", post.image);
        await fs
          .unlink(imagePath)
          .catch((err) => console.error("Error deleting image:", err));
      }
      posts = posts.filter((post: any) => post.id !== id);
      await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, action, increment, user } = await request.json();
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    let posts = JSON.parse(fileContent);

    const postIndex = posts.findIndex((post: any) => post.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (action === "like") {
      if (user === "You" && increment < 0) {
        posts[postIndex].likes = Math.max(
          0,
          posts[postIndex].likes + increment
        );
      } else {
        posts[postIndex].likes += 1;
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
