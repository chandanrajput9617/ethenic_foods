import React, { useEffect } from "react";
import WR360 from "@webrotate360/imagerotator";
import "@webrotate360/imagerotator/build/css/all.css";
import axios from 'axios';

const Test = ({data}) => {
    useEffect(() => {
        const webrotator = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_APP_BASE_API + `/api/v1/products/get-product-zifile/${data?.product?._id}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    mode: 'cors'
                });
                const viewer = WR360.ImageRotator.Create("webrotate360");
                viewer.licenseCode = "your-license-code";
                viewer.settings.configFileURL = await import.meta.env.VITE_APP_BASE_API + response.data.data.zipFile?.xml_url;
                viewer.settings.graphicsPath = await import.meta.env.VITE_APP_BASE_API + data?.zipFile?.image_url;
                viewer.settings.alt = "Your alt image description";
                viewer.settings.responsiveBaseWidth = 800;
                viewer.settings.responsiveMinHeight = 300;

                viewer.settings.apiReadyCallback = (api, isFullScreen) => {
                    api.images.onDrag((event) => {
                        console.log(
                            `${event.action
                            }; current image index = ${api.images.getCurrentImageIndex()}`
                        );
                    });
                };
                viewer.runImageRotator();
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                // setProductLoad(false);
            }
        }
        webrotator()

    }, []);
    return <div id="webrotate360"></div>;
};

export default Test;
