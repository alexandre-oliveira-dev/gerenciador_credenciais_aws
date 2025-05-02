import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import "./App.css";
import Title from "antd/es/typography/Title";
import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import {useQuery} from "react-query";

type CredentialsProps = {
  accessKeyId: string;
  secretKeyId: string;
  stage: string;
};

function App() {
  const [current, setCurrent] = useState<string>();
  const [open, setOpen] = useState(false);
  const [form] = useForm<{
    accessKeyId: string;
    secretKeyId: string;
    stage: string;
  }>();

  const {data, isLoading, refetch} = useQuery<CredentialsProps[]>({
    queryFn: async () =>
      (await fetch("http://localhost:8000/getAll", {method: "get"})).json(),
  });

  async function refetchCurrentStage() {
    const res = await fetch("http://localhost:8000/current", {
      method: "GET",
    });

    res.json().then(val => {
      setCurrent(String(val));
    });
  }

  useEffect(() => {
    async function get() {
      await refetchCurrentStage();
    }
    get();
  }, []);

  let credencial: CredentialsProps;

  async function toggleAwsCredentials() {
    if (!credencial.stage) {
      return;
    }

    await fetch("http://localhost:8000/changeCredential", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: `
[default]
aws_access_key_id: ${credencial?.accessKeyId}
aws_secret_access_key: ${credencial?.secretKeyId}
stage:${credencial?.stage}`,
      }),
    });
  }

  async function create() {
    const values = form.getFieldsValue();

    await form.validateFields();

    if (data?.find(i => i?.stage === values?.stage?.toLocaleLowerCase())) {
      const element = document.getElementById("toas-error");

      if (element) {
        element.style.display = "block";
        element.innerHTML = `Stage: ${values.stage}, já cadastrado`;
        element.style.color = "red";

        setTimeout(() => {
          element.style.display = "none";
        }, 2000);
      }
      return;
    }

    const body = JSON.stringify({
      accessKeyId: values.accessKeyId,
      secretKeyId: values.secretKeyId,
      stage: values.stage?.toLocaleLowerCase(),
    });

    await fetch("http://localhost:8000/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    }).then(() => {
      setOpen(false);
      refetch();
    });
  }

  async function remove(stage: string) {
    await fetch(`http://localhost:8000/delete?stage=${stage}`, {
      method: "delete",
    }).then(() => {
      refetch();
    });
  }

  return (
    <>
      <Modal
        okText="salvar"
        cancelText="cancelar"
        title={"Inserir nova credencial"}
        open={open}
        centered
        onOk={() => create()}
        onCancel={() => setOpen(false)}
      >
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
            <Input placeholder="Digite a chave secreta"></Input>
          </Form.Item>
          <Form.Item rules={[{required: true}]} name={"stage"} label="Stage">
            <Input placeholder="Digite o nome do stage"></Input>
          </Form.Item>
          <span id="toas-error"></span>
        </Form>
      </Modal>
      <Col
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "2rem",
        }}
      >
        <Row
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Title
            style={{display: "flex", alignItems: "center", gap: 20}}
            level={2}
          >
            <img
              width="90"
              height="90"
              src="https://img.icons8.com/color/100/amazon-web-services.png"
              alt="amazon-web-services"
            />
            Credenciais
          </Title>
        </Row>

        <Row
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            Nova +
          </Button>
        </Row>

        <Select
          placeholder="Selecione o stage"
          loading={isLoading}
          onChange={item => {
            const parse = JSON.parse(item) as CredentialsProps;
            credencial = parse;
          }}
        >
          {data?.map(item => {
            return (
              <Select.Option value={JSON.stringify(item)}>
                {item?.stage?.toLocaleUpperCase()}
              </Select.Option>
            );
          })}
        </Select>
        <br />
        <Button
          type="primary"
          onClick={async () => {
            await toggleAwsCredentials().then(async () => {
              const element = document.getElementById("success");
              if (element) {
                element.innerHTML = `Stage alterado para <strong>${credencial?.stage}</strong>`;
                element.style.display = "grid";
                await refetchCurrentStage();

                setTimeout(() => {
                  element.style.display = "none";
                }, 2000);
              }
            });
          }}
        >
          Alterar credencial
        </Button>
        <br />

        <Table
          size="small"
          dataSource={data}
          columns={[
            {
              title: "AccessKeyId",
              dataIndex: "accessKeyId",
              render(text) {
                return <Typography.Text copyable>{text}</Typography.Text>;
              },
            },
            {
              title: "SecretKeyId",
              dataIndex: "secretKeyId",
              render(text) {
                return <Typography.Text copyable>{text}</Typography.Text>;
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
                      {current && rec.stage === current && (
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
                  <>
                    <Button title="deletar" onClick={() => remove(rec.stage)}>
                      <img
                        width="20"
                        height="20"
                        src="https://img.icons8.com/fluency-systems-regular/48/trash--v1.png"
                        alt="trash--v1"
                      />
                    </Button>
                  </>
                );
              },
            },
          ]}
        ></Table>
        <Tag
          style={{
            alignItems: "center",
            fontSize: 20,
            display: "none",
            justifyContent: "center",
            padding: "1rem",
          }}
          color="green"
          id="success"
        ></Tag>
      </Col>
    </>
  );
}

export default App;
