import { Avatar, Button, Container, Divider, List, ListItem, Paper, Theme, Typography, colors } from '@mui/material'
import React, { createContext, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import {SxProps}  from "@mui/material"
import ListDocument from './ListDocument';
import { Document } from '../DTO/NavbarDto/Document.dto';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Chat_config } from '../DTO/PlaygroundDto/Chat_config';
import { upload_file } from '../../api/file/upload_file';
type Props = {}
export  const Doc_config = createContext< any>(null);
function Navbar({}: Props) {
  const AVATAR_SX : SxProps<Theme> ={
    width:'100px',
    height:'100px'
  }
  const ListItem_Sx :SxProps<Theme>={
    justifyContent:'center',
    textAlign:'center',
    display:"flex",
    flexDirection:"column"
  }
  const [chat_config,set_chat_config] = useState<Chat_config | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const handleFileInputChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile)
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        setUploadFile(data);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
    setUploadFile(selectedFile);
    const resp = await upload_file(selectedFile);
    console.log(resp.data)
    const {split_chunk,rawData, relevent_data} = resp.data;
    
    const init_chat_config :Chat_config= {
        chunkSize: relevent_data.chunkSize,
        chunkOverlap:relevent_data.chunkOVerlap,
        rawData:rawData,
        text_chunk: split_chunk,
        temperature :0.8,
        File: uploadFile!,
        system_msg: "Remeber the following data and use them to answer user question: "
    }
    set_chat_config(init_chat_config);
    //add corresponding tag to the navBar and select it 
    const new_document : Document ={
      DocId: 4 ,
      DocTitle: selectedFile.name ,
      DocType: selectedFile.type
    }
    setDocument((prev)=>[...prev, new_document])
    };  
  const triggerUpload = () => {
    const target_element = document.getElementById('upload');
    console.log(target_element)
    target_element?.click();
  }
  const [selectDoc, setselectDoc] = useState<number>(0);
 // const [Document, setDocument] = useState<Document[]>([]);
  const [Document, setDocument] = useState<Document[]>([
    {DocId: 1 , DocTitle:" 1 " , DocType:"pdf"},
    {DocId: 2 , DocTitle:" 2 " , DocType:"pdf"},
 
    {DocId: 3 , DocTitle:" 3 " , DocType:"pdf"}
  ]);
  return (
    <>
     <Doc_config.Provider value={{chat_config ,set_chat_config}}>

     <Container sx={{border:"1px solid black"}}>
       <input id='upload' style={{ display: 'none' }} type='file' onChange={handleFileInputChange} />

    <List>
   
      <ListItem sx={ListItem_Sx}>
        <Typography >
        Normal  USER 
        </Typography>
      </ListItem>
        <ListItem sx={ListItem_Sx}>
                <Avatar sx={AVATAR_SX}>
                <PersonIcon />
                </Avatar>
        </ListItem>
        <ListItem sx={ListItem_Sx}>
        <Typography sx={{fontWeight:"bold"}}>
            Edmund Chan
        </Typography>
      </ListItem>
      <Divider /> 
    
      
      <ListItem   sx={{display:'flex', flexDirection:"column" ,overflow:"scroll",height:"67vh",gap:"10px"}}>
 
        <Typography variant='h6'  >
            File uploaded
          </Typography>     
          <Divider />
          <Button fullWidth variant='contained' sx={{backgroundColor: colors.blue[500],padding:'1rem'}} onClick={triggerUpload}>
                <AddCircleOutlineIcon />
          </Button>
        { Document.map((item,i)=>{ 
          if(item.DocId === selectDoc)
                return ( <Button  fullWidth onClick={()=>{ setselectDoc(item.DocId)}} sx={{backgroundColor:colors.blue[400]}}>
                    <ListDocument data={item}/>
                </Button>)
          else
          return ( <Button fullWidth onClick={()=>{ setselectDoc(item.DocId)}} sx={{'&:hover':{
            background:colors.blue[100]
          }}}>
          <ListDocument data={item}/>
      </Button>)} ) }
     
      </ListItem>
 
    </List>
        
    </Container>



     </Doc_config.Provider>
    
    
    
    </>
  
  )
}

export default Navbar