import {
  acceptance,
  query,
  visible,
} from "discourse/tests/helpers/qunit-helpers";
import { click, fillIn, visit } from "@ember/test-helpers";
import { test } from "qunit";

acceptance("Header Search", function () {
  test("shows in header", async function (assert) {
    await visit("/");

    assert.ok(
      visible(".floating-search-input"),
      "search form present in header"
    );
    assert.ok(visible("#search-term"), "it shows the search input");
    assert.ok(
      visible(".show-advanced-search"),
      "it shows full page search button"
    );

    await click(".floating-search-input #search-term");
    await fillIn(".floating-search-input #search-term", "test");

    assert.ok(visible(".search-menu .results"), "it has results");
  });
});

acceptance("Header Search - Extra Icons", function (needs) {
  const itemsJSON = [
    {
      name: "google",
      params: [
        {
          name: "icon",
          value: "fab-google",
        },
        {
          name: "prefix",
          value: "https://www.google.com/search?q=",
        },
      ],
    },
    {
      name: "apple",
      params: [
        {
          name: "icon",
          value: "fab-apple",
        },
        {
          name: "prefix",
          value: "https://www.apple.com/search?q=",
        },
        {
          name: "showInCategories",
          value: "7",
        },
      ],
    },
    {
      name: "github",
      params: [
        {
          name: "icon",
          value: "fab-github",
        },
        {
          name: "prefix",
          value: "https://www.github.com/search?q=",
        },
        {
          name: "excludeFromCategories",
          value: "7",
        },
      ],
    },
  ];
  needs.hooks.beforeEach(() => {
    settings.extra_search_icons = JSON.stringify(itemsJSON);
  });

  needs.hooks.afterEach(() => {
    settings.extra_search_icons = "[]";
  });

  test("shows additional icons", async function (assert) {
    await visit("/");

    assert.ok(
      visible(".floating-search-input"),
      "search form present in header"
    );

    await click(".floating-search-input #search-term");
    await fillIn(".floating-search-input #search-term", "test");

    assert.ok(visible(".extra-search-icons"), "it has extra icons");

    assert.ok(
      visible(".extra-search-icons .search-extra-icon-google"),
      "it has the google search icon (as defined in theme settings)"
    );

    assert.strictEqual(
      query(".extra-search-icons .search-extra-icon-google").href,
      "https://www.google.com/search?q=test",
      "it appends current search term to external link"
    );

    assert.ok(
      visible(".extra-search-icons .search-extra-icon-github"),
      "it respects the excludeFromCategories parameter"
    );

    assert.ok(
      visible(".show-advanced-search"),
      "it still shows full page search button"
    );

    assert.notOk(
      visible(".floating-search-input .clear-search"),
      "it no longer shows the clear search button"
    );

    await visit("/c/dev/7");

    await click(".floating-search-input #search-term");

    assert.strictEqual(
      query(".extra-search-icons .search-extra-icon-apple").href,
      "https://www.apple.com/search?q=test",
      "it shows the apple icon in category #7 via showInCategories parameter"
    );

    assert.notOk(
      visible(".extra-search-icons .search-extra-icon-github"),
      "it respects the excludeFromCategories parameter"
    );
  });
});
