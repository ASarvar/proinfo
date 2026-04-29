"use client";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 200,
        background: "#EFF0F2",
        borderRadius: 6,
        border: "1px solid #EAEAF0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#94a3b8",
        fontSize: 13,
      }}
    >
      Loading editor…
    </div>
  ),
});

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function QuillEditor({ value, onChange }) {
  return (
    <div style={{ background: "#fff" }}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={MODULES}
      />
    </div>
  );
}
