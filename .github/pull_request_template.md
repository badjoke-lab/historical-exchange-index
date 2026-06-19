## Summary

Describe the change and why it is needed.

## Canonical data impact

- Entities: `+0 / -0 / unchanged`
- Events: `+0 / -0 / unchanged`
- Evidence: `+0 / -0 / unchanged`
- Canonical counts changed: `yes / no`

## Deployment impact

Select one:

- [ ] No public-output impact
- [ ] Public data/content change covered by GitHub CI
- [ ] Deployment-sensitive change
- [ ] Cloudflare preview explicitly required

Preview reason, when required:

```text
Not required / explain the Cloudflare-specific behavior being verified
```

## Required policy review

- [ ] I reviewed `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`.
- [ ] I reviewed `config/cloudflare-pages-project.json` when deployment controls or build watch paths changed.
- [ ] This PR does not create unnecessary Cloudflare preview builds.
- [ ] Deployment-sensitive files are identified and justified.
- [ ] Temporary diagnostic files and workflows are removed.

## Validation

- [ ] GitHub CI passed.
- [ ] `npm run policy:check` passed.
- [ ] Record validation passed when canonical records changed.
- [ ] Machine-readable validation passed when public output changed.
- [ ] HTML/JSON consistency validation passed when public output changed.

Commands or checks performed:

```text
List commands and relevant results
```

## Production verification

For public-output changes, state how production will be verified after the deployed `/version.json` commit matches `main`.

```text
Not applicable / verification plan
```
