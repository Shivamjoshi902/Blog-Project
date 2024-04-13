const conf = {
    appwriteUrl : String(import.meta.env.VITE_AAPPWRITE_URL),
    appwriteProjectId : String(import.meta.env.VITE_AAPPWRITE_PROJECT_ID),
    appwriteBucketId : String(import.meta.env.VITE_AAPPWRITE_BUCKET_ID),
    appwriteCollectionId : String(import.meta.env.VITE_AAPPWRITE_COLLECTION_ID),
    appwriteDatabaseId : String(import.meta.env.VITE_AAPPWRITE_DATABASE_ID)
}

export default conf