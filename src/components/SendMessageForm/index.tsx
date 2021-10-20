import { FormEvent, ReactNode, useContext, useState } from "react";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../context/auth";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  async function handleSendMessage(e:FormEvent){
    e.preventDefault();
    if(!message.trim()){
      return
    }

    await api.post("messages",{message})
    setMessage('')
  }
  return (
    <>
      <div className={styles.sendMessageFormWrapper}>
        <button className={styles.signOutButton} onClick={signOut}>
          <VscSignOut size="32" />
        </button>
        <header className={styles.userInformation}>
          <div className={styles.userImage}>
            <img src={user?.avatar_url} alt={user?.name} />
          </div>
          <strong className={styles.userName}>{user?.name}</strong>
          <span className={styles.userGithub}>
            <VscGithubInverted size="16" />
            {user?.login}
          </span>
        </header>

        <form className={styles.sendMessageForm} onSubmit={handleSendMessage}>
          <label htmlFor="message">Mensagem</label>
          <textarea
            name="message"
            id="message"
            placeholder="Qual sua expectativa para evento ?"
            onChange={(event) => setMessage(event.target.value)}
            value={message}
          ></textarea>

          <button type="submit">Enviar Mensagem</button>
        </form>
      </div>
    </>
  );
}

export default SendMessageForm;
