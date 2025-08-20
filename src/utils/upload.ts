import axios from 'axios';

const API_URL = 'https://api.quenth.com';

export const uploadSingleFile = async (file: File): Promise<string> => {
    if (!(file instanceof File)) {
        throw new Error('Invalid file provided');
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload/single`, formData);
    return response.data.data;
};

export const uploadMultipleFiles = async (files: File[]) => {
    let allFiles: string[] = [];
    const formData = new FormData();
    const filesArray = Array.from(files);
    filesArray.forEach(file => {
        if (file instanceof File) {
            formData.append(`files`, file);
        } else if (typeof file == 'string') {
            allFiles.push(file);
        }
    });
    if (!formData.get('files')) {
        return allFiles;
    }
    const response = await axios.post(`${API_URL}/upload/multiple`, formData);
    allFiles = [...allFiles, ...response.data.data];
    return allFiles;
};