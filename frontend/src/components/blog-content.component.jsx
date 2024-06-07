import React from 'react'
import Img from './img.component';
import Quote from './quote.component';
import List from './list.component';


const BlogContent = ({block}) => {
    let {type,data}=block;
    if(type=="paragraph"){
        return <p dangerouslySetInnerHTML={{__html:data.text}}></p>
    }
    if(type=="header"){
        if(data.level==3){
            return <h3 className='text-3xl font-medium  ' dangerouslySetInnerHTML={{__html:data.text}} ></h3>
        }
        return <h2 className='text-4xl font-bold  ' dangerouslySetInnerHTML={{__html:data.text}} ></h2>
    }
    if(type=="image"){
        return <Img url={data.file.url} caption={data.caption} />
    }
    if(type=="quote"){
        return <Quote quote={data.text} caption={data.caption} />
    }
    if(type=="list"){
        return <List style={data.style} items={data.items}  />
    }
}

export default BlogContent
