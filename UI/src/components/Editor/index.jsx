import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // include styles

const Editor = ({ content, setContent }) => {
  //   const [content, setContent] = useState("");

  const handleContentChange = (content) => {
    setContent(content);
  };

  return <ReactQuill value={content} onChange={handleContentChange} />;
};

export default Editor;
