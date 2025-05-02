import {Button, Col, Row, Select} from "antd";
import "./App.css";
import Title from "antd/es/typography/Title";
import {useState} from "react";
import {useForm} from "antd/es/form/Form";
import {useQueries} from "react-query";
import {Footer} from "antd/es/layout/layout";
import InsertComponent from "./components/insertComponentModal";
import {create, toggleAwsCredentials} from "./services/httpRequests";
import useToast from "./components/toastHook";
import Toast from "./components/toast";
import TableComponent from "./components/tableComponent";
import {FiEye} from "react-icons/fi";
import {GiSemiClosedEye} from "react-icons/gi";

export type CredentialsProps = {
  accessKeyId: string;
  secretKeyId: string;
  stage: string;
};

function App() {
  const [open, setOpen] = useState(false);
  const [form] = useForm<CredentialsProps>();
  let credencial: CredentialsProps;
  const {toastProps, showToast} = useToast();
  const [hidden, setIsHidden] = useState(false);

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
            alignItems: "center",
            marginBottom: 10,
            gap: 10,
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
          <Button
            onClick={() => {
              if (hidden) {
                setIsHidden(false);
                return;
              }
              setIsHidden(true);
            }}
          >
            {hidden ? <FiEye></FiEye> : <GiSemiClosedEye></GiSemiClosedEye>}
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
              refetchCurrentStage();
              showToast({
                color: "green",
                text: `Stage alterado para: ${credencial?.stage}`,
              });
            });
          }}
        >
          Alterar credencial
        </Button>
        <br />

        <TableComponent
          isHidden={hidden}
          currentCredential={currentCredential}
          data={data}
          refetch={refetch}
        ></TableComponent>
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
      <Toast {...toastProps}></Toast>
    </>
  );
}

export default App;
