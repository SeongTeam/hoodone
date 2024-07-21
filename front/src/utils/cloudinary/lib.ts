import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import logger from '@/utils/log/logger';
import { UploadApiResponse, type UploadApiErrorResponse } from 'cloudinary';

const configCld = {
    secure: true,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config({
    ...configCld,
});

const UPLOAD_TARGET = {
    QUEST: 'quests',
    SB: 'submissions',
    USER_PROFILE: 'profiles',
} as const;

type UploadTargetType = (typeof UPLOAD_TARGET)[keyof typeof UPLOAD_TARGET];

// Public function
export function validateImage(imageFile: File) {
    /*TODO 
        - image 유효성 확인 로직 구현
    */
    if (imageFile && imageFile.size > 0) return true;

    return false;
}

export async function uploadQuestImage(file: File, authorEmail: string) {
    return uploadImage(file, authorEmail, UPLOAD_TARGET.QUEST);
}

export async function uploadSubmissionImage(file: File, authorEmail: string) {
    return uploadImage(file, authorEmail, UPLOAD_TARGET.SB);
}

export async function uploadUserProfileImage(file: File, authorEmail: string) {
    return uploadImage(file, authorEmail, UPLOAD_TARGET.USER_PROFILE);
}

// Internal function

async function uploadImage(ImageFile: File, authorEmail: string, type: UploadTargetType) {
    try {
        const arrayBuffer = await ImageFile.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const timeStamp = Date.now();
        const fileName = `[${timeStamp}]_${ImageFile.name}_${authorEmail}`;
        const folder = await createSubFolder(type);

        let ret: UploadApiResponse | null = null;
        /*TODO
            - ref : https://cloudinary.com/documentation/image_upload_api_reference#upload_optional_parameters
        */
        // Large File upload logic.
        ret = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        display_name: `${fileName}`,
                        asset_folder: `${folder}`,
                        use_asset_folder_as_public_id_prefix: true,
                    },
                    (error, result) => {
                        if (error) {
                            reject(error as UploadApiErrorResponse);
                            return;
                        }
                        resolve(result as UploadApiResponse);
                    },
                )
                .end(buffer);
        })
            .then((uploadResult) => {
                return uploadResult as UploadApiResponse;
            })
            .catch((error) => {
                logger.error('uploadStream error', { message: error });
                throw new Error('uploadStream error');
            });
        logger.info('ret: ', ret);

        return ret.public_id;
    } catch (error) {
        logger.error('cloudinary.config(): ', cloudinary.config());
        logger.error('uploadThumbnail error', { message: error });
        return null;
    }
}

async function createSubFolder(type: UploadTargetType) {
    const time = new Date();
    let parentFolder: string | null = null;
    switch (type) {
        case UPLOAD_TARGET.QUEST:
            parentFolder = 'quests';
            break;
        case UPLOAD_TARGET.SB:
            parentFolder = 'submissions';
            break;
        case UPLOAD_TARGET.USER_PROFILE:
            parentFolder = 'profiles';
            break;
        default:
            break;
    }

    if (!parentFolder) {
        logger.error('createSubFolder error');
        throw new Error('createSubFolder error');
    }

    const createYear = `[${time.getFullYear()}]`;
    logger.info('createYear: ', createYear);
    const folderName = `${parentFolder}/${createYear}`;
    await cloudinary.api
        .create_folder(folderName)
        .then((result) => logger.info('create_folder success', { message: result }))
        .catch((error) => {
            logger.error('cloudinary create_folder error', { message: error });
            throw new Error('createQuestSubFolder error');
        });

    logger.info('createQuestSubFolder success', folderName);
    return folderName;
}

export async function uploadSmallFile(formData: FormData, folder: string) {
    let ret = null;
    try {
        const base64String = formData.get('Base64') as string;
        await cloudinary.api.create_folder(folder).catch((error) => {
            logger.error('cloudinary create_folder error', { message: error });
            throw new Error('[uploadSmallFile] create_folder error');
        });
        await cloudinary.uploader
            .upload(base64String, {
                use_filename: true,
                asset_folder: `${folder}`,
                use_asset_folder_as_public_id_prefix: true,
            })
            .then((uploadResult) => {
                ret = uploadResult as UploadApiResponse;
                logger.info('Buffer uploadResult: ', uploadResult);
                logger.info('public_id: ', ret.public_id);
            })
            .catch((error) => {
                logger.error('upload error', { message: error });
                throw new Error('upload error');
            });

        logger.info('ret: ', { message: ret });

        return ret;
    } catch (error) {
        logger.error('cloudinary.config(): ', cloudinary.config());
        logger.error('uploadThumbnail error', { message: error });
        return null;
    }
}
