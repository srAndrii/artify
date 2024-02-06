import {connectToDB} from "@mongodb/database";
import {writeFile} from "fs/promises";
import Work from "@models/Work";

export async function POST(req) {
    try {
        //Connect to DB
        await connectToDB();

        const data = await req.formData();

        //Extract info from the data

        const creator = data.get("creator");
        const category = data.get("category");
        const title = data.get("title");
        const description = data.get("description");
        const price = data.get("price");

        // Get an  array of uploded photos
        const photos = data.getAll("photos");

        /* Create a new Work */
        const newWork = new Work({
            creator,
            category,
            title,
            description,
            price,
            workPhotoPaths: photos,
        });

        await newWork.save();

        return new Response(JSON.stringify(newWork), {status: 200});
    } catch (err) {
        console.log(err);
        return new Response("Failed to create a new Work", {status: 500});
    }
}
