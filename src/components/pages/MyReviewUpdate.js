import React, { useEffect, useState } from "react";
import Base from "../../UI/Form/Base";
import Primary from "../../UI/Button/Primary";
import Memo from "../../UI/Form/Memo";
import PageCover from "../features/PageCover";
import making from "./MakingPlanner.module.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../components/Tokens/getToken";
import axios from "axios";
import Ghost from "../../UI/Button/Ghost";

const MyReviewUpdate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [removeImagesUrl, setRemoveImagesUrl] = useState([]);
  const navigate = useNavigate();
  const token = getToken();
  const [selectFiles, setSelectFiles] = useState([]);
  const previousButtonClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const title = localStorage.getItem("reviewTitle");
    const content = localStorage.getItem("reviewContent");
    const reviewImageList = JSON.parse(localStorage.getItem("reviewImageList"));
    console.log(reviewImageList);

    const imageList = [];
    reviewImageList.map((image) => {
      // const data = {
      //   "id": image.id,
      //   "fileName": image.imageUrl
      // }

      imageList.push(image);
    });

    setImagePreviews(imageList);
    setTitle(title);
    setContent(content);
  }, []);
  //사진 post
  const FilePlus = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviewsArray = [...imagePreviews];
    const newFiles = [...selectFiles];
    files.forEach(async (file) => {
      const previewURL = URL.createObjectURL(file);
      imagePreviewsArray.push(previewURL);
      setImagePreviews(imagePreviewsArray);
      selectFiles.push(file);
      const formData = new FormData();
      formData.append("uploadFiles", file);
      console.log("FormData에 추가된 파일:", formData.get("uploadFiles"));
      try {
        const response = await axios.post(
          "http://localhost:8080/file/upload",
          formData,
          {
            headers: {
              "Content-Type": false,
              Authorization: token,
            },
          }
        );
        if (response.data) {
          console.log("파일 업로드 성공:", response.data);
          let removeImagesUrlArray = [...removeImagesUrl];
          removeImagesUrlArray.push(response.data[0].imageUrl);
          setRemoveImagesUrl(removeImagesUrlArray);
          newFiles.push({
            fileName: file.name,
            uuid: response.data[0].uuid,
            folderPath: response.data[0].folderPath,
          });
        } else {
          console.error("파일 업로드 실패:", response.data);
        }
      } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
      }
    });
    setSelectFiles(newFiles);
  };

  //사진delete
  const handleRemoveImage = async (index) => {
    // console.log(removeImagesUrl[index]);
    console.log(imagePreviews[index]);

    const data = [...removeImages];
    data.push(imagePreviews[index]);
    setRemoveImages(data);

    console.log(selectFiles);

    try {
      const response = await axios.post(
        "http://localhost:8080/file/remove?fileName=" +
          imagePreviews[index].imageUrl
      );
      if (response.data) {
        let updatedImagePreviews = [...imagePreviews];
        updatedImagePreviews.splice(index, 1);
        setImagePreviews(updatedImagePreviews); // 해당 이미지 미리보기 제거
        let updatedRemoveImagesUrl = [...removeImagesUrl];
        updatedRemoveImagesUrl.splice(index, 1);
        setRemoveImagesUrl(updatedRemoveImagesUrl); //해당 이미지 url 제거
      } else {
        console.error("파일 삭제 실패");
      }
    } catch (error) {
      console.error("파일 삭제 중 오류 발생:", error);
    }
  };

  //리뷰 수정하기
  const handleEditReviewSubmit = async () => {
    try {
      console.log(removeImages);

      let data = {
        id: localStorage.getItem("reviewId"),
        title: title,
        content: content,
        plannerId: localStorage.getItem("plannerId"),
        reviewImageDTOList: selectFiles,
        removeImageDTOList: removeImages,
      };
      console.log(data);
      const response = await axios.put(
        "http://localhost:8080/review/update",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.data) {
        console.log("서버 응답 데이터:", response.data);
        alert("리뷰가 성공적으로 수정되었습니다.");

        localStorage.removeItem("plannerId");
        localStorage.removeItem("reviewId");
        localStorage.removeItem("reviewTitle");
        localStorage.removeItem("reviewContent");
        localStorage.removeItem("reviewImageList");

        navigate("/mypost");
      } else {
        console.error("리뷰 수정이 되지않았습니다.");
      }
      localStorage.removeItem("placeData");
    } catch (error) {
      console.error("리뷰 수정 중 오류 발생:", error);
    }
  };

  return (
    <>
      <PageCover
        title={
          localStorage.getItem("placeData") ? "리뷰 만들기" : "리뷰 수정하기"
        }
      />
      <div className="not-layout">
        <div className="container">
          <Ghost text="이전으로" onClick={previousButtonClick} />
          <form className={making.form}>
            <dl className={making.list}>
              <div className={making.item}>
                <dt>제목</dt>
                <dd>
                  <Base
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </dd>
              </div>
              <div className={making.item}>
                <dt>리뷰 메모</dt>
                <dd>
                  <Memo
                    placeholder="메모를 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </dd>
              </div>
              <div className={making.item} style={{ marginBottom: "30px" }}>
                <dt>사진 추가</dt>
                <dd>
                  <input type="file" multiple onChange={FilePlus} />
                </dd>
              </div>
              {imagePreviews.length > 0 && (
                <div className={making.item}>
                  <dt>선택 사진</dt>
                  <dd>
                    {imagePreviews.map((data, index) => (
                      <div key={index}>
                        <img
                          key={index}
                          src={`http://localhost:8080/file/display?fileName=${data.imageUrl}`}
                          alt={`Preview ${index}`}
                          style={{
                            width: "230px",
                            height: "130px",
                            margin: "2px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          data-name=""
                          className={making.deleteButton}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            <>
              <Primary
                text="리뷰 수정하기"
                onClick={handleEditReviewSubmit}
                style={{ marginBottom: "8px" }}
              />
            </>
          </form>
        </div>
      </div>
    </>
  );
};

export default MyReviewUpdate;
