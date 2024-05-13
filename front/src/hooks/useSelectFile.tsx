import React, { useState } from "react";



const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<File|null>();

  const onSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      console.log("[onSelectedFile]", event.target.files[0]);
      setSelectedFile(event.target.files[0]);
    }

  };

  const onDroppedFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("[onDroppedFile]", event);

    if (event.dataTransfer.items) {
      const item = event.dataTransfer.items[0];

      if(item.kind === "file"){
        const file = item.getAsFile();

        if(file && file.type.startsWith("image/")){
          setSelectedFile(file);
        }
        else{
          alert("Please select an image file");
        }
      }
      else{
        console.log("[onDroppedFile] Dropped item is not file kind", item);
      }
    }
  };

  return { selectedFile, setSelectedFile, onSelectedFile, onDroppedFile };
};
export default useSelectFile;
