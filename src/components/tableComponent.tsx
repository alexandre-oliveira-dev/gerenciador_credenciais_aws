import {Button, Form, Input, Row, Table, Tag, Typography} from "antd";
import {CredentialsProps} from "../App";
import {edit, remove, toggleAwsCredentials} from "../services/httpRequests";
import {MdChangeCircle} from "react-icons/md";
import useToast from "./toastHook";
import Toast from "./toast";
import {FiEdit} from "react-icons/fi";
import {useEffect, useState} from "react";
import ModalConfirmComponent from "./modalConfirmComponent";
import TextArea from "antd/es/input/TextArea";
import {useForm} from "antd/es/form/Form";

export default function TableComponent({
  data,
  currentCredential,
  refetch,
  refetchCurrentStage,
  isHidden,
}: {
  data: CredentialsProps[] | undefined;
  currentCredential: string | undefined;
  refetch: () => void;
  refetchCurrentStage: () => void;
  isHidden: boolean;
}) {
  const [open, setOpen] = useState(false);
  const {showToast, toastProps} = useToast();
  const [stageSelected, setStageSelected] = useState<CredentialsProps>();
  const [form] = useForm<CredentialsProps>();

  function handleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }

  useEffect(() => {
    form.setFieldsValue({
      ...stageSelected,
      sessionToken: stageSelected?.sessionToken || undefined,
    });
  }, [stageSelected, form]);

  return (
    <>
      <Table
        rowKey={x => x.accessKeyId}
        size="small"
        dataSource={data}
        columns={[
          {
            title: "AccessKeyId",
            dataIndex: "accessKeyId",
            render(text) {
              return (
                <Typography.Text id="hiddenKey" copyable>
                  {isHidden ? "************" : text}
                </Typography.Text>
              );
            },
          },
          {
            title: "SecretKeyId",
            dataIndex: "secretKeyId",
            render(text) {
              return (
                <Typography.Text id="hiddenKey" copyable>
                  {isHidden ? "************" : text}
                </Typography.Text>
              );
            },
          },

          {
            title: "Stage",
            dataIndex: "stage",
            render(text, rec) {
              return (
                <Row>
                  <Tag style={{textTransform: "capitalize"}} color="blue">
                    {text}
                  </Tag>
                  <>
                    {currentCredential &&
                      rec?.stage === currentCredential?.trim() && (
                        <Tag color="green">{"Atual"}</Tag>
                      )}
                  </>
                </Row>
              );
            },
          },
          {
            title: "Ações",
            render(_, rec) {
              return (
                <Row style={{gap: 10}}>
                  <Button
                    title="alterar"
                    onClick={async () => {
                      await toggleAwsCredentials(rec).then(() => {
                        refetchCurrentStage();
                        showToast({
                          color: "green",
                          text: `Stage alterado para: ${rec?.stage}`,
                        });
                      });
                    }}
                  >
                    <MdChangeCircle size={20} color="green"></MdChangeCircle>
                  </Button>
                  <Button
                    title="editar"
                    onClick={async () => {
                      setStageSelected(rec);
                      handleOpen();
                    }}
                  >
                    <FiEdit color="gold" size={15}></FiEdit>
                  </Button>
                  <Button
                    title="deletar"
                    onClick={() => remove({refetch, stage: rec.stage})}
                  >
                    <img
                      width="14"
                      height="14"
                      src="https://img.icons8.com/fluency-systems-regular/48/trash--v1.png"
                      alt="trash--v1"
                    />
                  </Button>
                </Row>
              );
            },
          },
        ]}
      ></Table>
      <Toast {...toastProps}></Toast>
      <ModalConfirmComponent
        content={
          <>
            <Form layout="vertical" form={form}>
              <Form.Item
                rules={[{required: true}]}
                name={"accessKeyId"}
                label="AccessKeyId"
              >
                <Input placeholder="Digite a chave"></Input>
              </Form.Item>
              <Form.Item
                rules={[{required: true}]}
                name={"secretKeyId"}
                label="SecretKeyId"
              >
                <Input placeholder="Insira a chave secreta"></Input>
              </Form.Item>
              <Form.Item
                rules={[{required: true}]}
                name={"stage"}
                label="Stage"
              >
                <Input placeholder="Insira o nome do stage"></Input>
              </Form.Item>
              <Form.Item name={"sessionToken"} label="sessionToken">
                <TextArea placeholder="Insira o sessionToken (opcional)"></TextArea>
              </Form.Item>
              <span id="toas-error"></span>
            </Form>
          </>
        }
        handleOpen={handleOpen}
        open={open}
        title={`Editar stage: ${stageSelected?.stage}`}
        fn={async () => {
          await edit({
            refetch,
            credencial: stageSelected as CredentialsProps,
          }).then(() => {
            refetchCurrentStage();
            showToast({
              color: "green",
              text: `Stage alterado para: ${stageSelected?.stage}`,
            });
          });
        }}
      ></ModalConfirmComponent>
    </>
  );
}
