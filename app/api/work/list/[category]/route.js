import Work from "@models/Work";
import {connectToDB} from "@mongodb/database";

export const GET = async (req, {params}) => {
    try {
        await connectToDB();

        const {category} = params;

        let worklist;

        if (category !== "All") {
            worklist = await Work.find({category}).populate("creator");
        } else {
            worklist = await Work.find().populate("creator");
        }

        return new Response(JSON.stringify(worklist), {status: 200});
    } catch (err) {
        console.log(err);
        return new Response("Failed to fetch Work List", {status: 500});
    }
};
