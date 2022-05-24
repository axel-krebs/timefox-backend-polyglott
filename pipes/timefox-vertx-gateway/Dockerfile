FROM openjdk:19-slim-buster

ARG APP_USER
ARG PASS_WORD
ARG ZIP_FILE_NAME
ENV USER_NAME ${APP_USER}
ENV INSTALL_DIR .

COPY "$ZIP_FILE_NAME" .

ADD install.sh .
RUN chmod ugo=rwx install.sh

# The install.sh will echo the installation directory of the extracted ZIP
RUN ["/bin/bash","-c","echo $(./install.sh ${USER_NAME} ${PASS_WORD} ${ZIP_FILE_NAME})"]

USER ${USER_NAME}

# Since Docker does not persist configurations while creating the image, the PATH set in .bashrc must be sourced
ENTRYPOINT ["/bin/bash","-c","cd && source .bashrc && exec timefox-vertx-gateway"]
#CMD ["/bin/bash","-c","cd && source .bashrc && echo $PATH & tail -f /dev/null"]

EXPOSE 8080 8443
