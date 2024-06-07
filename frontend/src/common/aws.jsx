import axios from "axios";
import { blogEndpoints } from "../../services/apis";

const { IMG_UPLOAD } = blogEndpoints;

export const uploadImage = async (img) => {
    let imgUrl = null;
    await axios.get(IMG_UPLOAD)
        .then(async ({ data: { uploadURL } }) => {
            await axios({
                method: 'PUT',
                url: uploadURL,
                headers: { 'Content-Type': 'multipart/form-data' },
                data: img
            })
                .then(() => {
                    imgUrl = uploadURL.split("?")[0]
                })
        })
    return imgUrl
}