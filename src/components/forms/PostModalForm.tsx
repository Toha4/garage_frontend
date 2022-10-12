import React from "react";
import { Form, Modal } from "antd";
import { useForm } from "react-hook-form";
import { ActionTypes } from "../../helpers/types";
import { PostType } from "../../services/types";
import PostService from "../../services/PostService";
import { IFormPostInputs } from "../interface";
import InputForm from "./components/InputForm";

interface IPostModalForm {
  pk: number | null;
  open: boolean;
  onOk: (category: PostType) => void;
  onCancel: () => void;
}

const PostModalForm: React.FC<IPostModalForm> = ({ pk, open, onOk, onCancel }) => {
  const DataPostService = new PostService();

  const action: ActionTypes = pk ? ActionTypes.EDIT : ActionTypes.ADD;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    control,
  } = useForm<IFormPostInputs>({
    defaultValues: {
      name: "",
    },
  });

  React.useEffect(() => {
    register("name", { required: "Введите наименование поста!" });

    if (action === ActionTypes.EDIT && pk) {
      const onDataLoaded = (data: PostType) => {
        setValue("name", data.name);
      };

      const onError = (error: any) => {
        alert(error);
      };

      DataPostService.getPost(pk).then(onDataLoaded).catch(onError);
    }
  }, []);

  const onSubmit = (data: IFormPostInputs) => {
    const postData: PostType = {
      name: data.name,
    };

    const onSuccess = (data: PostType) => {
      onOk(data);
    };

    const onFailed = (error: any) => {
      if (error.response.data?.name[0] === "Пост с таким Наименование уже существует.") {
        setError("name", { type: "custom", message: "Пост с таким наименованием уже существует!" });
      } else {
        alert(error.responseText);
      }
    };

    if (action === ActionTypes.EDIT && pk) {
      DataPostService.updatePost(pk, postData).then(onSuccess).catch(onFailed);
    } else {
      DataPostService.createPost(postData).then(onSuccess).catch(onFailed);
    }
  };

  const handleOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <Modal
        title={action === ActionTypes.ADD ? "Новый пост" : "Редактирование поста"}
        width={450}
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okText={action === ActionTypes.ADD ? "Добавить" : "Изменить"}
      >
        <Form layout="vertical">
          <Form.Item
            label="Наименование"
            required
            validateStatus={errors.name ? "error" : "success"}
            help={errors.name ? errors.name.message : null}
          >
            <InputForm name="name" control={control} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PostModalForm;
