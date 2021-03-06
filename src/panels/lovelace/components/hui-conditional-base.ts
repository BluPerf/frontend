import { customElement, property, UpdatingElement } from "lit-element";

import {
  checkConditionsMet,
  validateConditionalConfig,
} from "../common/validate-condition";
import { HomeAssistant } from "../../../types";
import { LovelaceCard } from "../types";
import { LovelaceRow, ConditionalRowConfig } from "../entity-rows/types";
import { ConditionalCardConfig } from "../cards/types";

@customElement("hui-conditional-base")
export class HuiConditionalBase extends UpdatingElement {
  @property() public hass?: HomeAssistant;
  @property() public editMode?: boolean;
  @property() protected _config?: ConditionalCardConfig | ConditionalRowConfig;
  protected _element?: LovelaceCard | LovelaceRow;

  protected validateConfig(
    config: ConditionalCardConfig | ConditionalRowConfig
  ): void {
    if (!config.conditions) {
      throw new Error("No conditions configured.");
    }

    if (!Array.isArray(config.conditions)) {
      throw new Error("Conditions should be in an array.");
    }

    if (!validateConditionalConfig(config.conditions)) {
      throw new Error("Conditions are invalid.");
    }

    if (this.lastChild) {
      this.removeChild(this.lastChild);
    }

    this._config = config;
  }

  protected update(): void {
    if (!this._element || !this.hass || !this._config) {
      return;
    }

    this._element.editMode = this.editMode;

    const visible =
      this.editMode || checkConditionsMet(this._config.conditions, this.hass);

    this.style.setProperty("display", visible ? "" : "none");

    if (visible) {
      this._element.hass = this.hass;
      if (!this._element.parentElement) {
        this.appendChild(this._element);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-conditional-base": HuiConditionalBase;
  }
}
