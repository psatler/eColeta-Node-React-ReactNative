import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'


import './styles.css'
import { FiUpload } from 'react-icons/fi'

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles)
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);
  
      setSelectedFileUrl(fileUrl)
      onFileUploaded(file)
    }
  }, [onFileUploaded])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept='image/*'/>
      {
        selectedFileUrl
        ? <img src={selectedFileUrl} alt="Point thumbnail"/>
        : isDragActive ?
          <p>
              <FiUpload />
              Solte aqui a imagem do estabelecimento ...
          </p> :
          <p>
            <FiUpload />  
            Solte aqui a imagem do estabelecimento ou clique e selecione uma imagem
          </p>

      }
    </div>
  )
}

export default Dropzone;