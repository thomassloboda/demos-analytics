let currentPage = 1;
let allData = [];

const fetchBeers = () => {
  return new Promise((resolve, reject) => {
    document.dispatchEvent(
      new CustomEvent("dataLoad", { detail: { currentPage } })
    );
    fetch(`https://api.punkapi.com/v2/beers?page=${currentPage}`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject);
  });
};

const getRandomFloat = (min, max, decimals) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

const getSkeletonElement = () => {
  if (!document.querySelector("#punk-item-skeleton")) {
    const element = document.createElement("li");
    element.id = "punk-item-skeleton";
    element.classList.add(
      "vtmn-bg-background-primary",
      "vtmn-shadow-200",
      "vtmn-p-4",
      "vtmn-my-2",
      "vtmn-flex",
      "vtmn-flex-row",
      "vtmn-justify-between"
    );
    element.innerHTML =
      '<div class="vtmn-w-full"><h3 class="vtmn-w-full vtmn-flex vtmn-flex-row vtmn-justify-between"><span class="vtmn-skeleton vtmn-skeleton_line" style="width: 35%">&nbsp;</span><span class="vtmn-skeleton vtmn-skeleton_line" style="width: 10%">&nbsp;</span></h3></div>';
    return element;
  }
  return null;
};

const getLoadMoreButton = () => {
  if (!document.querySelector("#punk-item-loadmore")) {
    const element = document.createElement("li");

    const button = document.createElement("button");
    button.classList.add("vtmn-btn", "vtmn-btn_size--stretched");
    button.id = "punk-item-loadmore";
    button.innerText = "Load more";
    button.onclick = () => {
      document.querySelector("#punk-item-loadmore").remove();
      currentPage += 1;
      loadMore();
    };
    element.appendChild(button);

    return element;
  }
  return null;
};

const list = document.querySelector("#punk-list");
let observer;

list.appendChild(getSkeletonElement());

const showProductModal = (item) => {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add(
    "vtmn-w-full",
    "vtmn-h-full",
    "vtmn-fixed",
    "vtmn-top-0"
  );
  modalContainer.style.backgroundColor =
    "var(--vtmn-semantic-color_hover-tertiary-transparent)";
  modalContainer.id = "punk-modal";

  const modal = document.createElement("div");
  modal.classList.add("vtmn-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "vtmn-modal-title");
  modal.setAttribute("aria-describedby", "vtmn-modal-description");

  const modalContent = document.createElement("div");
  modalContent.classList.add("vtmn-modal_content");

  const modalContentTitle = document.createElement("div");
  modalContentTitle.classList.add("vtmn-modal_content_title");

  const modalContentTitleText = document.createElement("span");
  modalContentTitleText.classList.add("vtmn-modal_content_title--text");
  modalContentTitleText.innerText = item.name;

  modalContentTitle.appendChild(modalContentTitleText);

  const modalCloseButton = document.createElement("button");
  modalCloseButton.classList.add(
    "vtmn-btn",
    "vtmn-btn_variant--ghost",
    "vtmn-btn--icon-alone"
  );
  modalCloseButton.innerHTML = `<span class="vtmx-close-line" aria-hidden="true"></span><span class="vtmn-sr-only">Close modal</span>`;
  modalCloseButton.onclick = () => {
    document.querySelector("#punk-modal").remove();
  };

  modalContentTitle.appendChild(modalCloseButton);

  modalContent.appendChild(modalContentTitle);

  const modalContentBody = document.createElement("div");
  modalContentBody.classList.add("vtmn-modal_content_body");

  const modalContentBodyPriceTag = document.createElement("span");
  modalContentBodyPriceTag.classList.add(
    "vtmn-price",
    "vtmn-price_variant--accent"
  );
  modalContentBodyPriceTag.innerText = item.price;
  modalContentBody.appendChild(modalContentBodyPriceTag);

  const modalContentBodyDescription = document.createElement("p");
  modalContentBodyDescription.classList.add("vtmn-modal_content_body--text");
  modalContentBodyDescription.innerText = item.description;
  modalContentBody.appendChild(modalContentBodyDescription);

  modalContent.appendChild(modalContentBody);

  const modalContentActions = document.createElement("div");
  modalContentActions.classList.add("vtmn-modal_content_actions");

  const modalContentActionAddToCart = document.createElement("button");
  modalContentActionAddToCart.classList.add(
    "vtmn-btn",
    "vtmn-btn_variant--conversion"
  );
  modalContentActionAddToCart.innerText = "add to cart";
  modalContentActionAddToCart.onclick = () => {
    document.dispatchEvent(new CustomEvent("addToCart", { detail: item }));
    document.querySelector("#punk-modal").remove();
  };
  modalContentActions.appendChild(modalContentActionAddToCart);

  modalContent.appendChild(modalContentActions);

  modal.appendChild(modalContent);
  modalContainer.appendChild(modal);
  document.dispatchEvent(new CustomEvent("itemDisplayed", { detail: item }));

  document.body.appendChild(modalContainer);
};

const loadMore = () => {
  const skeleton = getSkeletonElement();
  if (skeleton) list.appendChild(skeleton);
  fetchBeers()
    .then((data) => {
      const _data = data.map((item) => ({
        ...item,
        price: `$${getRandomFloat(0.99, 6.99, 2)}`,
      }));
      allData = [...allData, ..._data];
      document.dispatchEvent(
        new CustomEvent("dataLoaded", { detail: { currentPage, items: data } })
      );
      document.querySelector("#punk-item-skeleton").remove();
      _data.forEach((item) => {
        const element = document.createElement("li");
        element.id = `punk-item-${item.id}`;
        element.classList.add(
          "hover:vtmn-bg-background-secondary",
          "hover:vtmn-cursor-pointer",
          "vtmn-bg-background-primary",
          "vtmn-shadow-200",
          "vtmn-p-4",
          "vtmn-my-2",
          "vtmn-flex",
          "vtmn-flex-row",
          "vtmn-justify-between"
        );

        const nameLabel = document.createElement("span");
        nameLabel.innerText = item.name;
        element.appendChild(nameLabel);

        const priceLabel = document.createElement("span");
        priceLabel.innerText = item.price;
        element.appendChild(priceLabel);

        element.onclick = () => {
          document.dispatchEvent(
            new CustomEvent("itemClicked", { detail: item })
          );
          showProductModal(item);
        };

        list.appendChild(element);

        observer.observe(element);
      });
      list.appendChild(getLoadMoreButton());
    })
    .catch(console.error);
};

document.querySelector("#punk-singnin").addEventListener("click", (e) => {
  if (!e.target.hasAttribute("loggedin")) {
    e.target.setAttribute("loggedin", true);
    const name = "John Doe";
    e.target.innerText = name;
    document.dispatchEvent(
      new CustomEvent("userAuthenticated", {
        detail: { name, id: "29ce8c67-9ee4-4528-a279-3ed778f2ec73" },
      })
    );
  }
});

setTimeout(() => {
  observer = new IntersectionObserver(
    (elements) => {
      elements.forEach((element) => {
        if (
          element.intersectionRatio > 0 &&
          !["punk-item-skeleton", "punk-item-loadmore"].includes(
            element.target.id
          )
        ) {
          observer.unobserve(element.target);
          const item = allData.find(
            (i) =>
              i.id === parseInt(element.target.id.replace("punk-item-", ""), 10)
          );
          document.dispatchEvent(
            new CustomEvent("itemPrinted", { detail: item })
          );
        }
      });
    },
    {
      root: list,
      rootMargin: "0px",
      threshold: 0.5,
    }
  );
  loadMore();
}, 100);
