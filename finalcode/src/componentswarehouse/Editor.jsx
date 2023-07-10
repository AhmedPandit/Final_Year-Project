import React from 'react'
import {HtmlEditor,Inject,RichTextEditorComponent} from "@syncfusion/ej2-react-richtexteditor";
import {EditorData} from '../data/dummy'
import {Header} from "."

const Editor = () => {
  return (

    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded3-xl'>
      
      <Header category="Description about your product" title="Product Description"/>
        <RichTextEditorComponent>
          <EditorData/>
          <Inject services={[HtmlEditor]}/>
        </RichTextEditorComponent>

      
      
      </div>
  )
}

export default Editor