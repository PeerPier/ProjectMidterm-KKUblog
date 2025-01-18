import { Link, useNavigate, useParams } from "react-router-dom";
import logoKKU from "../pic/logo-head.jpg";
import "../misc/blogEdit.css";
import defaultBanner from "../pic/blog banner.png";
import { uploadImage } from "../common/b2";
import { useContext, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { tools } from "../components/tools.component";
import { UserContext } from "../App";
import AnimationWrapper from "../Screens/page-animation";
import { EditorContext } from "../Screens/editor-page";
import axios from "axios";

const BlogEditor = () => {
  const API_URL =
    process.env.REACT_APP_API_ENDPOINT ||
    "https://kku-blog-server-ak2l.onrender.com";
  const editorContext = useContext(EditorContext);
  let { blog_id } = useParams();

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const navigate = useNavigate();

  if (!editorContext) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }

  const {
    blog,
    blog: { topic, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = editorContext;

  useEffect(() => {
    if (!textEditor?.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "มาเขียนเรื่องราวสุดเจ๋งกันเถอะ!",
        })
      );
    }
  }, []);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    const loadingToast = toast.loading("Uploading...");
    if (img) {
      uploadImage(img) // ถ้ามีไฟล์เรียกใช้ uploadImage
        .then((url) => {
          console.log("Uploaded URL:", url);
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded!");
            setBlog({ ...blog, banner: url });
            console.log("Uploaded URL:", url);
            console.log("Updated Blog Banner:", { ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err.message || "Error uploading image.");
        });
    } else {
      toast.dismiss(loadingToast);
      toast.error("Please select an image."); // แจ้งเตือนถ้าไม่มีการเลือกไฟล์
    }
    console.log("Banner URL:", banner);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, topic: input.value });
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    let img = e.currentTarget;
    img.src = defaultBanner;
  };

  const handlePublishEvent = () => {
    if (!banner.length) {
      return toast.error("อัพโหลดแบนเนอร์เพื่อเผยแพร่");
    }

    if (!topic.length) {
      return toast.error("เขียนหัวข้อบล็อกเพื่อเผยแพร่");
    }

    if (textEditor?.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("เผยแพร่");
          } else {
            return toast.error("เขียนอะไรบางอย่างเพื่อเผยแพร่");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // const handlePublishEvent = () => {
  //   if (!banner.length) {
  //     return toast.error("upload a blog banner to publish it");
  //   }

  //   if (!topic.length) {
  //     return toast.error("write blog topic to publish it");
  //   }

  //   if (textEditor?.isReady) {
  //     textEditor
  //       .save()
  //       .then((data) => {
  //         if (data.blocks.length) {
  //           setBlog({ ...blog, content: data });
  //           setEditorState("เผยแพร่");
  //         } else {
  //           return toast.error("เขียนบางอย่างในบล็อกเพื่อเเผยแพร่");
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  const handleSaveDraft = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;

    if (target.className.includes("disable")) {
      return;
    }

    if (!topic.length) {
      return toast.error("เขียนชื่อบล็อกก่อนบันทึกฉบับร่าง");
    }

    let loadingToast = toast.loading("กำลังบันทึกฉบับร่าง...");
    target.classList.add("disable");

    if (textEditor?.isReady) {
      textEditor.save().then(async (content) => {
        let blogObj = {
          topic,
          banner,
          des,
          content,
          tags,
          draft: true,
        };

        axios
          .post(
            API_URL + "/create-blog",
            { ...blogObj, id: blog_id },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(() => {
            (e.target as HTMLButtonElement).classList.remove("disable");

            toast.dismiss(loadingToast);
            toast.success("บันทึกแล้ว");

            setTimeout(() => {
              navigate("/dashboard/blogs?tab=draft");
            }, 500);
          });
      });
    }
  };

  return (
    <>
      <nav className="navbar-navbar">
        <Link to="/" className="logo-link">
          <img src={logoKKU} alt="" className="logo-img" />
        </Link>

        <p className=" new-blog">{topic.length ? topic : ""}</p>

        <div className="d-flex gap-4" style={{ marginLeft: "auto" }}>
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            เผยแพร่
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            บันทึกร่าง
          </button>
        </div>
      </nav>
      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="Banner-divhost">
            <div className="Banner-div ">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  alt=""
                  style={{ zIndex: "20" }}
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={topic}
              placeholder="Blog Title"
              className="custom-textarea"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-100 my-1" style={{ opacity: "0.1" }} />

            <div id="textEditor"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
