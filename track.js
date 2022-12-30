/// <Methods>

const page = (path, title) => {
  (window?.dataLayer || []).push({
    event: "pageview",
    page: {
      path,
      title,
    },
  });
};

const setProperty = (key, value) => {
  (window?.dataLayer || []).push({
    [key]: value,
  });
};

const track = (category, action, label, value) => {
  (window?.dataLayer || []).push({
    event: "track",
    category,
    action,
    label,
    value,
  });
};

/// </Methods>

/// <Listeners>

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState === "complete") {
    page("/", "Punk API list");
  }
});

document.addEventListener("userAuthenticated", ({ detail: data }) => {
  setProperty("user_id", data.id);
  setProperty("user_name", data.name);
});

document.addEventListener("itemClicked", ({ detail: data }) =>
  track(
    "catalog",
    "click_item",
    data.name,
    parseInt(data.price.replace("$", ""), 10)
  )
);

document.addEventListener("itemPrinted", ({ detail: data }) => {
  track(
    "catalog",
    "print_item",
    data.name,
    parseInt(data.price.replace("$", ""), 10)
  );
});

document.addEventListener("itemDisplayed", ({ detail: data }) => {
  page(`/product/${data.id}`, data.name);
});

document.addEventListener("addToCart", ({ detail: data }) => {
  track(
    "catalog",
    "addToCart",
    data.name,
    parseInt(data.price.replace("$", ""), 10)
  );
});

/// </Listeners>
