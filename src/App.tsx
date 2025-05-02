import {Button, Col, Row, Select, Table, Tag, Typography} from "antd";
import "./App.css";
import Title from "antd/es/typography/Title";
import {useState} from "react";
import {useForm} from "antd/es/form/Form";
import {useQueries} from "react-query";
import {Footer} from "antd/es/layout/layout";
import InsertComponent from "./components/insertComponentModal";
import {create, remove, toggleAwsCredentials} from "./services/httpRequests";

export type CredentialsProps = {
  accessKeyId: string;
  secretKeyId: string;
  stage: string;
};

function App() {
  const [open, setOpen] = useState(false);
  const [form] = useForm<CredentialsProps>();
  let credencial: CredentialsProps;

  const [
    {data, isLoading, refetch},
    {data: currentCredential, refetch: refetchCurrentStage},
  ] = useQueries<[CredentialsProps[], string]>([
    {
      queryFn: async (): Promise<CredentialsProps[]> =>
        (await fetch("http://localhost:65000/getAll", {method: "get"})).json(),
      queryKey: "getAll",
    },
    {
      queryFn: async (): Promise<string> =>
        (await fetch("http://localhost:65000/current", {method: "get"})).json(),
      queryKey: "current",
    },
  ]) as [
    {
      data: CredentialsProps[] | undefined;
      isLoading: boolean;
      refetch: () => void;
    },
    {data: string | undefined; refetch: () => void}
  ];

  function handleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }

  return (
    <>
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
            await toggleAwsCredentials(credencial).then(() => {
              const element = document.getElementById("success");
              if (element) {
                element.innerHTML = `Stage alterado para <strong>${credencial?.stage}</strong>`;
                element.style.display = "grid";
                refetchCurrentStage();

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
                      {currentCredential && rec.stage === currentCredential && (
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
                    <Button
                      title="deletar"
                      onClick={() => remove({refetch, stage: rec.stage})}
                    >
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
      <Footer
        style={{
          position: "absolute",
          bottom: "0px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <p>Versão do sistema: v1.0.0</p>
      </Footer>
      <InsertComponent
        create={() => create({data, form, refetch, setOpen})}
        form={form}
        handleOpen={handleOpen}
        open={open}
      ></InsertComponent>
    </>
  );
}

export default App;
