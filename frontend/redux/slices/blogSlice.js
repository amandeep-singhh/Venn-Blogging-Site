import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    desc: '',
    author: { personal_info: {} },
    editorState: "editor",
    textEditor: { isReady: false }
}

const blogSlice = createSlice({
    name: 'blog',
    initialState: initialState,
    reducers: {
        setTitle: (state, value) => {
            state.title = value.payload
        },
        removeTitle: (state, value) => {
            state.title = ''
        },
        setBanner: (state, value) => {
            state.banner = value.payload
        },
        setContent: (state, value) => {
            state.content = value.payload
        },
        setTags: (state, value) => {
            if(Array.isArray(value.payload)){
                state.tags=value.payload;
            }else{
                state.tags.push(value.payload)
            }
            
        },
        removeTag: (state, value) => {
            const tagToRemove = value.payload
            const index = state.tags.findIndex((t) => t == tagToRemove);
            state.tags.splice(index, 1);

        },
        setDesc: (state, value) => {
            state.desc = value.payload
        },
        setAuthor: (state, value) => {
            state.author = value.payload
        },
        setTextEditor: (state, value) => {
            state.textEditor = value.payload
        },
        setEditorState: (state, value) => {
            state.editorState = value.payload
        },
        resetBlogState: (state, value) => {
            state.title = '';
            state.banner = '';
            state.content = [];
            state.tags = [];
            state.desc = '';
            state.author = { personal_info: {} };
            state.textEditor = { isReady: false };
            state.editorState = "editor"
        }

    }
})

export const { setTitle, setBanner, setTextEditor, setContent, setAuthor, setDesc, setEditorState, setTags, removeTag,resetBlogState,removeTitle } = blogSlice.actions;
export default blogSlice.reducer;