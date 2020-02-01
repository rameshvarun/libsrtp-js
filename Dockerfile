FROM ubuntu:18.04
RUN apt update
RUN apt-get install -y curl git python cmake

RUN git clone https://github.com/emscripten-core/emsdk.git
RUN cd emsdk && git pull && ./emsdk install 1.39.6-fastcomp && ./emsdk activate 1.39.6-fastcomp

RUN echo "source /emsdk/emsdk_env.sh" >> ~/.bashrc

CMD ["/bin/bash"]
