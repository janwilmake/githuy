export default {
  fetch: async (request: Request) => {
    const url = new URL(request.url);
    const [owner, repo, page] = url.pathname.split("/").slice(1);
    if (!owner) {
      return new Response("Usage /owner[/repo]", { status: 400 });
    }

    if (owner && !repo) {
      const location = `https://chat.uithub.com?context=${encodeURIComponent(
        `https://dashboard.uithub.com/${owner}/dashboard.md?focus=README.md`,
      )}`;
      return new Response("Redirecting", {
        status: 302,
        headers: { location },
      });
    }
    if (owner && repo && (!page || page === "blob" || page === "tree")) {
      url.searchParams.set("accept", "text/markdown");
      if (!url.searchParams.get("maxTokens")) {
        url.searchParams.set("maxTokens", "25000");
      }
      const location = `https://chat.uithub.com?context=${encodeURIComponent(
        `https://uithub.com${url.pathname}${url.search}`,
      )}`;
      return new Response("Redirecting", {
        status: 302,
        headers: { location },
      });
    }
    return new Response("Unavailable", { status: 400 });
  },
};
