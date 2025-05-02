import {FormInstance} from "antd";
import {CredentialsProps} from "../App";
import React from "react";

const apiUrl = "http://localhost:65000";

export async function toggleAwsCredentials(credencial: CredentialsProps) {
  if (!credencial.stage) {
    return;
  }

  await fetch(`${apiUrl}/changeCredential`, {
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

export async function create({
  data,
  form,
  refetch,
  setOpen,
}: {
  data: CredentialsProps[] | undefined;
  form: FormInstance;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}) {
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

  await fetch(`${apiUrl}/create`, {
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

export async function remove({
  stage,
  refetch,
}: {
  stage: string;
  refetch: () => void;
}) {
  await fetch(`${apiUrl}/delete?stage=${stage}`, {
    method: "delete",
  }).then(() => {
    refetch();
  });
}
