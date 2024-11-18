import { v2 as cloudinary } from 'cloudinary'
import { toast } from 'sonner'

// cloudinary.config({
//   cloud_name: import.meta.env.CLOUD_NAME,
//   api_key: import.meta.env.API_KEY,
//   api_secret: import.meta.env.API_SECRET,
// })

export const handleDeleteAsset = async (id: string) => {
  //   try {
  //     cloudinary.uploader.destroy(id, function (error, result) {
  //       toast.success('Item Removed')
  //     })
  //   } catch (error) {
  //     toast.error('Uh oh! Something went wrong.', {
  //       description: 'There was a problem with your request.',
  //     })
  //   }
}
