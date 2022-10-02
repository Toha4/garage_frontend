import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import PostService from "../../../services/PostService";
import { PostType } from "../../../services/types";

const { Option } = Select;

interface ISelectStatus {
  name: string;
  control: any;
}

const SelectPostForm: React.FC<ISelectStatus> = ({ name, control }) => {
  const DataPostService = new PostService();

  const [posts, setPosts] = React.useState<PostType[]>();

  React.useEffect(() => {
    const onDataLoaded = (data: PostType[]) => {
      setPosts(data);
    };

    const onError = (error: any) => {
      alert(error);
    };

    DataPostService.getPosts().then(onDataLoaded).catch(onError);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select allowClear placeholder="Выберите" {...field}>
          {posts &&
            posts.map((post, index) => (
              <Option key={index} value={post.pk}>
                {post.name}
              </Option>
            ))}
        </Select>
      )}
    />
  );
};

export default SelectPostForm;
