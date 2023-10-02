// src/CardList.js
import React, { useState } from "react";
import CardItem from "./CardItem";
import { Box, Modal } from "@mui/material";
import DynamicForm from "./DynamicForm";

function CardList({ cardData, modifyTripData }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {cardData.map((card, index) => (
        <CardItem
          key={index}
          card={card}
          onClick={() => handleCardClick(index + 1)}
        />
      ))}
      {selectedCard && (
        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box
            style={{
              position: "absolute",
              background: "white",
              padding: "20px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <DynamicForm
              modifyTripData={modifyTripData}
              intialFields={cardData[selectedCard - 1]}
              actionBtn={{
                primary: {
                  text: "Update",
                  action: () => {},
                },
                secondary: {
                  text: "Delete",
                  action: () => {
                    modifyTripData("delete", selectedCard - 1);
                    setModalOpen(false);
                  },
                  isSubmit: true,
                },
              }}
            />
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default CardList;
