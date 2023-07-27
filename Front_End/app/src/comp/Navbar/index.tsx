import { Avatar, Button, Container, Divider, Grid, List, ListItem, Paper, Theme, Typography, colors } from '@mui/material'
import React, {useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { SxProps } from "@mui/material"
import ListDocument from './ListDocument';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { upload_file } from '../../api/file/upload_file';
import PlayGround from '../Playground';
import { get_user_document_list } from '../../api/get_user_document/get_user_document';
import { get_file_from_s3 } from '../../api/file/get_file_from_s3';
import { Document } from '../DTO/NavbarDto/Document.dto';
type Props = {}
 
function Navbar({ }: Props) {
 
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selected_Doc_id, set_selected_Doc_id] = useState<string>("");
  const [blob, setblob] = useState<null| Uint8Array>(null);
  // const [Document, setDocument] = useState<Document[]>([]);
  const [Document, setDocument] = useState<Document[]>([
  ]);
  //function
  const handleFileInputChange = async (event: any) => {
    const selectedFile : File = event.target.files[0];
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
    set_selected_Doc_id(resp.data.doc_id);
    const blob_uint8Array = new Uint8Array(await selectedFile.arrayBuffer())
    setblob(blob_uint8Array)
    await load_user_document()
    
  };
  const triggerUpload = () => {
    const target_element = document.getElementById('upload');
    console.log(target_element)
    target_element?.click();
  }
  const loadDocument = async (DocId: string,FileName:string) => {
    console.log(DocId)
    const  resp = await get_file_from_s3(FileName);
    if(resp === undefined || resp === null) {alert("ERROR LOADING FILE (CONNECTING TO S3)")
     return;}
    //set blob data 
    setblob(resp)
     
    set_selected_Doc_id(DocId);
  }
  const load_user_document = async()=>{
    const resp = await get_user_document_list();
    console.log('user document list load success')
    setDocument(resp.data)
}

  //const
  const AVATAR_SX: SxProps<Theme> = {
    width: '100px',
    height: '100px'
  }
  const ListItem_Sx: SxProps<Theme> = {
    justifyContent: 'center',
    textAlign: 'center',
    display: "flex",
    flexDirection: "column"
  }
 
  console.log(Document)
  useEffect(()=>{
     
    load_user_document()
  },[])
  return (
    <>
 
        <Grid container sx={{gap:'0px'}}>
          <Grid item xs={2} >
            <Container sx={{marginTop:'20px'}} >
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
                  <Typography sx={{ fontWeight: "bold" }}>
                    Edmund Chan
                  </Typography>
                </ListItem>
                <Divider />


                <ListItem sx={{ display: 'flex', flexDirection: "column", overflow: "scroll", height: "67vh", gap: "10px" }}>

                  <Typography variant='h6'  >
                    File uploaded
                  </Typography>
                  <Divider />
                  <Button fullWidth variant='contained' sx={{ backgroundColor: colors.blue[500], padding: '1rem' }} onClick={triggerUpload}>
                    <AddCircleOutlineIcon />
                  </Button>
                  {Document.map((item, i) => {
                    if (item.doc_id === selected_Doc_id)
                      return (<Button fullWidth onClick={() => { loadDocument(item.doc_id,item.FileName) }} sx={{ backgroundColor: colors.blue[400] }}>
                        <ListDocument data={item} />
                      </Button>)
                    else
                      return (<Button fullWidth onClick={() => { loadDocument(item.doc_id,item.FileName) }} sx={{
                        '&:hover': {
                          background: colors.blue[100]
                        }
                      }}>
                        <ListDocument data={item} />
                      </Button>)
                  })}

                </ListItem>

              </List>

            </Container>
      
          </Grid>
          <Grid item xs={10}>
                  {blob&&<PlayGround doc_id={selected_Doc_id}   File={blob}/>}
          </Grid>
        </Grid>




 



    </>

  )
}

export default Navbar