import Loader from "components/UI/Loader";
import { useAuthContext } from "context/auth/authContext";
import { useMessageContext } from "context/messageContext/messageContext";
import useAxiosWithCallback from "hooks/useAxiosWithCallback";
import React, { useLayoutEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import styles from "./NotificationCard.module.css";

const NotificationCard = ({ notification, onResolve, type }) => {
  console.log(notification);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChevron, setShowChevron] = useState(false);

  const { isLoading, error, fetchData, fetchData: createConversation, } = useAxiosWithCallback();

  const { user } = useAuthContext();

  const messageElement = useRef(null);

  const { openMessageModal } = useMessageContext();

  const handleResolve = async () => {
    const config = {
      url: "/api/v1/users/notifications/resolve/" + notification._id,
      method: "patch",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    };
    user && (await fetchData(config));

    onResolve();
  };

  useLayoutEffect(() => {
    if (
      messageElement.current.clientWidth < messageElement.current.scrollWidth
    ) {
      setShowChevron(true);
    } else {
      setShowChevron(false);
    }
  }, [messageElement]);
  if (isLoading) return <Loader />;

  const handleContact = () => {
    const conversationConfig = {
      url: "/api/v1/conversation/",
      method: "post",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
      data: {
        // TODO: Change the reciever id
        receiver: "62e7b5dcacc6af6dd485c391",
      },
    };
    createConversation(conversationConfig, (conversation) => {
      openMessageModal(conversation._id);
    });
  }

  return (
    <div
      className={`${styles.notification_card} ${isExpanded && styles.expanded
        } ${type === 1 && styles.header}`}
    >
      <div className={`${styles.message} `}>
        <p ref={messageElement}>{notification.message}</p>
        {notification.type === "alumni-reject" && (
          <div className={styles.actions}>
            <button
              onClick={() => {
                window?.confirm(
                  'Are you sure? Accepting this notification leads to deletion of your provided alumni data at "Apply as Alumni" page '
                ) && handleResolve();
              }}
              className={styles.accept}
            >
              Accept
            </button>
            <button className={styles.contact} onClick={handleContact}>Contact</button>
          </div>
        )}
      </div>

      {type !== 0 && type !== 1 && (
        <>
          {showChevron && (
            <RiArrowDropDownLine
              fontSize={30}
              className={styles.arrow_btn}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
          {notification.type !== "alumni-reject" && (
            <IoClose
              className={styles.close_btn}
              onClick={handleResolve}
              fontSize={20}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NotificationCard;
