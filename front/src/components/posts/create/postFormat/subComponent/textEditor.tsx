import React from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

/* TODO
- Toolbar UI 커스터마이징
- Debuging
  - Editor의 value값을 class 내부에서 접근가능한가
  - class를 활용하는 이유가 무엇인가, Coponent prop에 module과 format을 전달하면 안되는 것인가?
*/

type TextEditorProps = {
    onChange: (body: string) => void;
    body: string;
};

class TextEditor extends React.Component<TextEditorProps> {
    constructor(props: TextEditorProps) {
        super(props);
        this.state = {
            body: '',
        };
    }

    handleContentChange = (body: string) => {
        this.setState({ body });
        if (this.props.onChange) {
            this.props.onChange(body);
        }
    };

    modules = {
        toolbar: [['bold', 'italic', 'strike'], [{ list: 'ordered' }], ['link']],
    };

    formats = ['bold', 'italic', 'strike', 'list', 'link'];

    render() {
        return (
            <div className="text-editor">
                <ReactQuill
                    theme="snow"
                    modules={this.modules}
                    formats={this.formats}
                    value={this.props.body}
                    onChange={this.handleContentChange}
                ></ReactQuill>
            </div>
        );
    }
}

export default TextEditor;
