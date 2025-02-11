# Blogger

A **Next.js** application that allows you to manage blog posts, handle subscriptions, and send email notifications when a new blog is published.  

## Features

1. **Public Blog View**  
   - Visitors can browse all published articles on the homepage.  
   - A **filter** (All, Startups, Technology, Lifestyle) lets users see only the articles in that category.  

2. **Subscription System**  
   - Users can enter their email to **subscribe** to new articles.  
   - Whenever a new blog post is added, subscribers automatically receive an email notification with the article’s title.

3. **Add & Edit Blogs** (Admin)  
   - Create a new blog post by providing a title, HTML-based description, category, author, and thumbnail image.  
   - Edit an existing blog to update any fields or replace the thumbnail.  
   - Blogs are stored in MongoDB.

4. **Admin Dashboard**  
   - **Blog List**: Shows all existing blogs. Click a title to edit, or delete a blog entirely.  
   - **Subscription List**: Displays all subscribed emails, with the option to remove any subscriber.

5. **Nodemailer Integration**  
   - Uses **Nodemailer** to automatically send emails to all subscribers when a new article is published.  
   - Configurable via environment variables for easy customization.

6. **MongoDB Integration**  
   - Stores all blog and subscriber data in MongoDB.

## Setup & Installation

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```

3. **Configure Environment Variables**  
   Create a `.env.local` file (or update your existing `.env` file) with the following:

   ```bash
   # MongoDB
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/dbname

   # SMTP (for Nodemailer)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yourEmail@gmail.com
   SMTP_PASS=yourAppPassword
   ```

   - Make sure **2FA** is enabled on your Gmail account (if using Gmail) and you’ve generated an **App Password** to use in `SMTP_PASS`.

4. **Run the Development Server**  
   ```bash
   npm run dev
   ```
   or  
   ```bash
   yarn dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) to view the site.

## Usage Guide

### 1. Public Blog View
- **Homepage**: Displays all blog articles by default.  
- **Category Filter**: Click “All,” “Startups,” “Technology,” or “Lifestyle” to see only those categories.  
- **Subscription**: Users can enter their email to subscribe to new article notifications.

### 2. Adding a Blog (Admin)
1. Navigate to **Add Blog** (e.g., `/admin/addProduct`).  
2. Upload a thumbnail image.  
3. Fill out **title**, **description** (HTML-supported), **category**, and **author**.  
   - For example, you can format the description with `<p>`, `<h2>`, `<strong>`, etc.
4. Submit to create the blog post.  
5. **All subscribers** get an email about the new article, containing its title.

### 3. Editing a Blog (Admin)
1. Go to **Blog List** (`/admin/blogList`).  
2. Click on a blog’s title to open the edit form.  
3. Update any fields (title, description, category, author, etc.).  
4. Submit to save changes.  

### 4. Managing Subscribers
- **Subscription List**: Shows all emails that have subscribed (`/admin/subscriptions`).  
- Delete any unwanted subscriber if needed.  

## Notes on the Description Format

- The **description** field supports **HTML** rendered via `dangerouslySetInnerHTML` in Next.js.  
- Include tags like `<p>`, `<h2>`, `<h3>`, `<strong>`, etc. to add structure and emphasis to your blog posts.

## Potential Enhancements

- **Queue for Sending Emails**: If you have many subscribers, consider using a background job or a specialized email service.  
- **Authentication**: Lock down admin pages so only authorized users can create, edit, or delete blogs.  
- **Better Templating**: Use HTML email templates for more polished subscriber notifications.

## Contributing

1. **Fork** the repository  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. **Commit** your changes (`git commit -m 'Add my feature'`)  
4. **Push** to the branch (`git push origin feature/my-feature`)  
5. Open a **Pull Request** describing your changes

## License

This project is open-sourced for personal demonstration purposes. Feel free to modify and adapt it to suit your own needs.