import { useEffect, useState } from "react";
import {Editor} from "react-draft-wysiwyg";
import { EditorState,convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "../../css/route/VideoWrite.scss";
import { RiPhoneFindLine } from 'react-icons/ri';

export default function VideoWrite(props){

    // const editorToHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [videoType,setVideoType] = useState(false);
    const [videoName,setVideoName]= useState("");

    const onWriteSubmit = (e)=>{
        const editorToHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }

    const uploadCallback = (file)=>{
        return new Promise(
            (resolve, reject)=>{
                var reader = new FileReader();
                reader.readAsDataURL(file);
                let img = new Image();
                reader.onload = function (e) {
                    img.src = this.result
                    resolve({
                      data: {
                        link: img.src
                      }
                    })
                }
            
            }
        );
    }
    return(
        <>
        <div className="write_wrap">
            <form>
                <table>
                    <tr>
                        <td colSpan='2'>
                            <input type="text" className="w_title" placeholder="제목을 입력해주세요" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <input type="text" className="writer" readOnly/>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            동영상
                            <p>직접선택<input type="checkbox" value="url" onChange={(e)=>{setVideoType(e.target.checked);}}/></p>
                        </th>
                        <td>
                            {
                                videoType ?  (
                                    <div className="file_wrap">
                                        <input type="text" readOnly placeholder="영상을 선택해주세요" defaultValue={videoName}/>
                                        <input type="file" id="video_url" onChange={(e)=>{setVideoName(e.target.files[0].name)}}/>
                                        <label htmlFor="video_url"><RiPhoneFindLine size="20"/></label>
                                    </div> 
                                ): <input type="text" className="video_file_text" defaultValue="https://"/> 
                                         
                            }      
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <Editor
                            localization={{
                                locale: 'ko',
                            }}
                            editorClassName="editor_save"
                            editorState = {editorState}
                            toolbar ={{
                                image : {
                                    urlEnabled: true,
                                    uploadEnabled: true,
                                    alignmentEnabled: true,
                                    previewImage: true,
                                    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                    alt: { present: false, mandatory: false },
                                    defaultSize: {
                                      height: 'auto',
                                      width: 'auto',
                                    },
                                    uploadCallback: uploadCallback     
                                }
                            }}
                            onEditorStateChange={(editorState)=>{
                                setEditorState(editorState);
                            }}
                            />
                        </td>
                    </tr>
                </table>  
                <div className="btn_wrap">
                    <input type="submit" className="btn" value="글쓰기"/>
                </div>    
            </form>
        </div>
        </>
    );
}