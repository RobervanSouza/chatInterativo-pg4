import React from 'react';
import * as S from "./styled";
import { MdDonutLarge, MdChat, MdMoreVert } from "react-icons/md";
import * as EmailValidator from "email-validator";
import { auth, db } from "../../Services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const Header = ({ setUserChat }) => {
  const [ user ] = useAuthState(auth);
  const chat = db.collection("chats").where("users", "array-contains", user.email);
  const [ chatExiste ] = useCollection(chat);

  const handleCreateChat = () => {
    const inputEmail = prompt("Digite seu e-mail");
    const inputName = prompt("Digite seu nome");

    if (!inputEmail || !inputName) return;
    if (!EmailValidator.validate(inputEmail)) {
      return alert("E-mail inválido!");
    } else if (inputEmail === user.email) {
      return alert("Insira um e-mail diferente do seu!");
    } else if (chatJaExiste(inputEmail)) {
      return alert("Chat já existe!");
    }

    db.collection("chats").add({
      users: [
        { email: user.email, name: user.displayName },
        { email: inputEmail, name: inputName },
      ],
    });
  };

  const chatJaExiste = (chatemail) => {
    return !!chatExiste?.docs.find((chat) =>
      chat.data().users.find((user) => user.email === chatemail)
    );
  };

  return (
    <div>
      <S.Container>
        <S.Avatar
          src={user?.photoURL}
          onClick={() => [ auth.signOut(), setUserChat(null) ]}
        />
        <S.Options>
          <MdDonutLarge />
          <MdChat onClick={handleCreateChat} />
          <MdMoreVert />
        </S.Options>
      </S.Container>
    </div>
  );
}

export default Header;
