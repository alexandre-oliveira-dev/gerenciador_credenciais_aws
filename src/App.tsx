/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Button, Col, Row, Select, Typography} from "antd";
import "./App.css";
import Title from "antd/es/typography/Title";
import {useEffect, useState} from "react";

type CredentialsProps = {
  stage?: string;
  default?: boolean;
  aws_access_key_id: string;
  aws_secret_access_key: string;
};

function App() {
  const crendencials = [
    {
      stage: "belem",
      default: false,
      aws_access_key_id: "AKIAXVVOPHOMCMK7FQNA",
      aws_secret_access_key: "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",
    },
    {
      stage: "votorantim",
      default: false,
      aws_access_key_id: "AKIAQFLZDWRNU7P4EVF2",
      aws_secret_access_key: "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",
    },
    {
      stage: "teste",
      default: false,
      aws_access_key_id: "AKIAWB23QWZNPQKARVAX",
      aws_secret_access_key: "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",
    },
  ];
  const [current, setCurrent] = useState<string>();

  async function refetch() {
    const res = await fetch("http://localhost:8000/current", {
      method: "GET",
    });

    res.json().then(val => {
      setCurrent(String(val));
    });
  }

  useEffect(() => {
    async function get() {
      await refetch();
    }
    get();
  }, []);

  let credencial: CredentialsProps;

  async function toggleAwsCredentials() {
    await fetch("http://localhost:8000/changeCredential", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: `
[default]
aws_access_key_id: ${credencial?.aws_access_key_id}
aws_secret_access_key: ${credencial?.aws_secret_access_key}
stage:${credencial?.stage}`,
      }),
    });
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
        <Title level={2}>Credenciais Aws</Title>

        <Row style={{alignItems: "center", gap: "10px"}}>
          <Typography.Title style={{margin: 0}} level={5}>
            Credencial atual:
          </Typography.Title>
          <p style={{margin: "0px", textTransform: "capitalize"}}>{current}</p>
        </Row>

        <Select
          placeholder="Selecione o stage"
          onChange={item => {
            const parse = JSON.parse(item) as CredentialsProps;

            parse.default = true;

            credencial = parse;
          }}
        >
          {crendencials.map(item => {
            return (
              <Select.Option value={JSON.stringify(item)}>
                {item.stage.toLocaleUpperCase()}
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
                element.innerText = `Stage alterado para ${credencial?.stage}`;
                element.style.display = "grid";
                await refetch();

                setTimeout(() => {
                  element.style.display = "none";
                }, 2000);
              }
            });
          }}
        >
          {" "}
          Alterar credencial
        </Button>
        <br />
        <div
          id="success"
          style={{
            width: "200px",
            height: "40px",
            background: "#00ff19",
            display: "none",
            placeContent: "center",
            color: "#fff",
            fontSize: "15px",
            borderRadius: "10px",
            padding: "10px",
          }}
        ></div>
      </Col>
    </>
  );
}

export default App;
