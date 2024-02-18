import Provider from "@components/Provider";
import {EdgeStoreProvider} from "@lib/edgestore";
import "@styles/globals.css";
import {Toaster} from "react-hot-toast";

export const metadata = {
    title: "Artify",
    description: "Discover and Share Art",
};

const layout = ({children}) => {
    return (
        <html lang='en'>
            <body>
                <Provider>
                    <Toaster position='top-center' reverseOrder={true} />
                    <EdgeStoreProvider>
                        <main>{children}</main>
                    </EdgeStoreProvider>
                </Provider>
            </body>
        </html>
    );
};

export default layout;
