#!/bin/bash
# Deprecated: TLS and reverse proxy are handled by the ALB + ACM (see infra/).
# Kept as a no-op so older docs/scripts that call setup.sh do not fail hard.
echo "setup.sh is deprecated. Use Terraform (infra/) and the ALB for HTTPS."
exit 0
