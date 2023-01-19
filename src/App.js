import { useState } from "react";
import { useForm } from "@pankod/refine-react-hook-form";
import { useSelect, useApiUrl } from "@pankod/refine-core";

import axios from "axios";
import './App.css'

// const MAX_COUNT = 5;

function App() {
    const [isUploading, setIsUploading] = useState(false);
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();
    const apiURL = useApiUrl();
    const { options } = useSelect({
        resource: "categories",
    });
	const [uploadedFiles, setUploadedFiles] = useState([])
    const [fileLimit, setFileLimit] = useState(false);


    const onSubmitFile =async () => {
        setIsUploading(true);
        const inputFile = document.getElementById(
            "fileInput",
        ) ;

        const formData = new FormData();
        formData.append("file", inputFile?.files?.item(0));

        // const res = await axios.post<{ url: string }>
        // (
        //     `${apiURL}/media/upload`,
        //     formData,
        //     {
        //         withCredentials: false,
        //         headers: {
        //             "Access-Control-Allow-Origin": "*",
        //         },
        //     },
        // );

        const res = await fetch("http://localhost:5000/upload-file", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());



        setValue("thumbnail", res.data.url);
        setIsUploading(false);

    }

  
    return (
        <form onSubmit={handleSubmit(onFinish)}>
            <label>Title: </label>
            <input {...register("title", { required: true })} />
            {errors.title && <span>This field is required</span>}
            <br />
            <label>Status: </label>
            <select {...register("status")}>
                <option value="published">published</option>
                <option value="draft">draft</option>
                <option value="rejected">rejected</option>
            </select>
            <br />
            <label>Category: </label>
            <select
                defaultValue={""}
                {...register("category.id", { required: true })}
            >
                <option value={""} disabled>
                    Please select
                </option>
                {options?.map((category) => (
                    <option key={category.value} value={category.value}>
                        {category.label}
                    </option>
                ))}
            </select>
            {errors.category && <span>This field is required</span>}
            <br />
            <label>Content: </label>
            <br />
            <textarea
                {...register("content", { required: true })}
                rows={10}
                cols={50}
            />
            {errors.content && <span>This field is required</span>}
            <br />
            <br />
            <label>Image: </label>
            <input id="fileInput" type="file" onChange={onSubmitFile} />
            <input
                type="hidden"
                {...register("thumbnail", { required: true })}
            />
            {errors.thumbnail && <span>This field is required</span>}
            <br />
            <br />
            <input type="submit" disabled={isUploading} value="Submit" />
            {formLoading && <p>Loading</p>}
        </form>
    );
};

export default App;
