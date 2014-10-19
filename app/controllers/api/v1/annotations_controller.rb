class Api::V1::AnnotationsController < ApplicationController
  respond_to :json
  before_filter :get_session, :only => :index

  api :GET, "/sessions/:session_id/annotations", "Get all annotations associated with a session"

  def index
    respond_with(@session.annotations, :location => api_v1_session_annotations_url(@session))
  end

  api :GET, "/sessions/:session_id/annotations/:id", "Get annotation by id for a session"

  def show
    annotation = get_annotation
    respond_with(annotation, :location => api_v1_session_annotation_url(params[:session_id], annotation))
  end

  api :POST, "/sessions/:session_id/annotations", "Create new annotation for a session"

  def create
    # TODO: Confirm that session has exists
    annotation = Annotation.create(annotation_params)

    respond_with(annotation, :location => api_v1_session_annotation_url(params[:session_id], annotation))
  end

  api :PUT, "/sessions/:session_id/annotations/:id", "Update existing annotation object for a session"

  def update
    annotation = get_annotation

    if annotation
      annote = annotation_params
      annotation.text = annote[:text]
      annotation.shapes = annote[:shapes]
      annotation.context = annote[:context]
      annotation.save
    end

    respond_with(annotation, :location => api_v1_session_annotation_url(params[:session_id], annotation))
  end

  api :DELETE, "/sessions/:session_id/annotations/:id", "Destroy an annotation from a session"

  def destroy
    respond_with(get_annotation.try(:destroy), :location => api_v1_session_annotations_url(params[:session_id]))
  end

  private
  def annotation_params
    annote = JSON.parse(params.require(:annotation))
    {text: annote['text'], shapes: annote['shapes'], context: annote['context'], session_id: params[:session_id]}
  end

  def get_annotation
    Annotation.find_id_and_session_id(params[:id], params[:session_id])
  end

  def get_session
    @session = Session.find(params[:session_id])
  end
end
